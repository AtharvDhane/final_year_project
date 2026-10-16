package com.smartresearch.assistant.service;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.*;

@Service
public class DataAnalysisService {

    private static final Logger logger = LoggerFactory.getLogger(DataAnalysisService.class);

    public Map<String, Object> analyzeData(MultipartFile file) throws Exception {
        String filename = file.getOriginalFilename();
        if (filename == null) {
            throw new IllegalArgumentException("File name is missing");
        }

        List<Map<String, String>> records = new ArrayList<>();
        List<String> headers = new ArrayList<>();

        if (filename.toLowerCase().endsWith(".csv")) {
            parseCsv(file, headers, records);
        } else if (filename.toLowerCase().endsWith(".xlsx")) {
            parseXlsx(file, headers, records);
        } else {
            throw new IllegalArgumentException("Unsupported file format. Please upload CSV or XLSX.");
        }

        return computeStatistics(headers, records);
    }

    private void parseCsv(MultipartFile file, List<String> headers, List<Map<String, String>> records) throws Exception {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String headerLine = reader.readLine();
            if (headerLine == null) return;
            
            String[] headerArray = headerLine.split(",");
            headers.addAll(Arrays.asList(headerArray));
            
            String line;
            while ((line = reader.readLine()) != null) {
                String[] values = line.split(",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)", -1); // Handle quotes
                Map<String, String> row = new HashMap<>();
                for (int i = 0; i < headers.size(); i++) {
                    String val = i < values.length ? values[i].replace("\"", "").trim() : "";
                    row.put(headers.get(i), val);
                }
                records.add(row);
            }
        }
    }

    private void parseXlsx(MultipartFile file, List<String> headers, List<Map<String, String>> records) throws Exception {
        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rowIterator = sheet.iterator();

            if (rowIterator.hasNext()) {
                Row headerRow = rowIterator.next();
                for (Cell cell : headerRow) {
                    headers.add(cell.getStringCellValue().trim());
                }
            }

            while (rowIterator.hasNext()) {
                Row row = rowIterator.next();
                Map<String, String> rowMap = new HashMap<>();
                for (int i = 0; i < headers.size(); i++) {
                    Cell cell = row.getCell(i, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK);
                    String val = "";
                    switch (cell.getCellType()) {
                        case STRING: val = cell.getStringCellValue(); break;
                        case NUMERIC: val = String.valueOf(cell.getNumericCellValue()); break;
                        case BOOLEAN: val = String.valueOf(cell.getBooleanCellValue()); break;
                        default: val = "";
                    }
                    rowMap.put(headers.get(i), val.trim());
                }
                records.add(rowMap);
            }
        }
    }

    private Map<String, Object> computeStatistics(List<String> headers, List<Map<String, String>> records) {
        Map<String, Object> overview = new HashMap<>();
        overview.put("totalRows", records.size());
        overview.put("totalColumns", headers.size());
        
        List<Map<String, Object>> columnStatsList = new ArrayList<>();
        
        for (String header : headers) {
            Map<String, Object> colStats = new HashMap<>();
            colStats.put("columnName", header);
            
            int missing = 0;
            boolean isNumeric = true;
            List<Double> numericValues = new ArrayList<>();
            Map<String, Integer> frequency = new HashMap<>();
            
            for (Map<String, String> row : records) {
                String val = row.get(header);
                if (val == null || val.isBlank()) {
                    missing++;
                } else {
                    frequency.put(val, frequency.getOrDefault(val, 0) + 1);
                    if (isNumeric) {
                        try {
                            numericValues.add(Double.parseDouble(val));
                        } catch (NumberFormatException e) {
                            isNumeric = false;
                        }
                    }
                }
            }
            
            colStats.put("missingValues", missing);
            colStats.put("type", isNumeric && numericValues.size() > 0 ? "Numeric" : "Categorical");
            
            if (isNumeric && !numericValues.isEmpty()) {
                Collections.sort(numericValues);
                double sum = numericValues.stream().mapToDouble(Double::doubleValue).sum();
                colStats.put("min", numericValues.get(0));
                colStats.put("max", numericValues.get(numericValues.size() - 1));
                colStats.put("mean", Math.round((sum / numericValues.size()) * 100.0) / 100.0);
                
                double median;
                int size = numericValues.size();
                if (size % 2 == 0) {
                    median = (numericValues.get(size/2 - 1) + numericValues.get(size/2)) / 2.0;
                } else {
                    median = numericValues.get(size/2);
                }
                colStats.put("median", median);
            }
            
            if (!isNumeric) {
                colStats.put("uniqueValuesCount", frequency.size());
                // Top 3 frequent values
                List<Map.Entry<String, Integer>> entries = new ArrayList<>(frequency.entrySet());
                entries.sort((a, b) -> b.getValue().compareTo(a.getValue()));
                List<String> topFreq = new ArrayList<>();
                for (int i = 0; i < Math.min(3, entries.size()); i++) {
                    topFreq.add(entries.get(i).getKey() + " (" + entries.get(i).getValue() + ")");
                }
                colStats.put("topFrequencies", topFreq);
            }
            
            columnStatsList.add(colStats);
        }
        
        overview.put("columns", columnStatsList);
        return overview;
    }
}
