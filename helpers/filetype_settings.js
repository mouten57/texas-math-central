module.exports = function (path, type) {
  switch (type) {
    case ".jpg":
    case ".jpeg":
    case ".png":
    case ".gif":
      return {
        File: path,
        EnableOcr: "true",
        AutoRotate: "true",
        AutoStraighten: "true",
        PdfVersion: "1.2",
        PdfTitle: "PdfFromImage",
      };
      break;
    case ".doc":
    case ".docx":
      return {
        File: path,
        PageRange: "1",
        ConvertMetadata: "false",
        EmbedFonts: "false",
        SubsetFonts: "false",
        PdfResolution: "10",
      };
      break;
    case ".xls":
    case ".xlsx":
      return {
        File: path,
        WorksheetIndex: "1",
        AutoFit: "true",
        ClearPrintArea: "true",
        Scale: "50",
        ConvertMetadata: "true",
        ConvertTags: "true",
        EmbedFonts: "true",
        SubsetFonts: "true",
        SubsetFontsThreshold: "50",
        PdfResolution: "100",
      };
      break;
    case ".ppt":
    case ".pptx":
      return {
        File: path,
        ConvertMetadata: "false",
        EmbedFonts: "false",
        SubsetFonts: "false",
        SubsetFontsThreshold: "50",
        PdfVersion: "1.2",
        PdfResolution: "10",
      };
      break;
    default:
      return {
        File: path,
        PageRange: "1",
      };
  }
};
