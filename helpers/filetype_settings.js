module.exports = function (path, type) {
  switch (type) {
    case "doc":
    case "docx":
      return {
        File: path,
        PageRange: "1",
        ConvertMetadata: "false",
        EmbedFonts: "false",
        SubsetFonts: "false",
        PdfResolution: "10",
      };
      break;
    case "xls":
    case "xlsx":
      return {
        File: path,
        WorksheetIndex: "1",
        AutoFit: "true",
        ClearPrintArea: "true",
        Scale: "10",
        ConvertMetadata: "false",
        ConvertTags: "false",
        EmbedFonts: "false",
        SubsetFonts: "false",
        SubsetFontsThreshold: "50",
        PdfResolution: "10",
      };
      break;
    case "ppt":
    case "pptx":
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
