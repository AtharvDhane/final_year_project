package com.smartresearch.assistant.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for document rename request.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RenameDocumentRequest {

    @NotBlank(message = "New file name cannot be blank")
    @Size(min = 1, max = 100, message = "File name must be between 1 and 100 characters")
    private String newFileName;
}
