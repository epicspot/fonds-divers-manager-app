
export const ct3Styles = `
  @page { 
    size: A4 portrait; 
    margin: 1cm; 
  }
  body { 
    font-family: 'Times New Roman', serif; 
    font-size: 11pt;
    line-height: 1.3;
    color: #000; 
    margin: 0;
    padding: 0;
  }
  .page {
    min-height: calc(100vh - 2cm);
    page-break-after: always;
  }
  .page:last-child {
    page-break-after: auto;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
    border-bottom: 1px solid #000;
    padding-bottom: 10px;
  }
  .header-left {
    text-align: left;
    font-size: 10pt;
    font-weight: bold;
    line-height: 1.2;
  }
  .header-center {
    text-align: center;
    font-weight: bold;
    font-size: 14pt;
    flex: 1;
    margin: 0 20px;
  }
  .header-right {
    text-align: right;
    font-size: 9pt;
    line-height: 1.2;
  }
  .section-title {
    text-align: center;
    font-weight: bold;
    font-size: 12pt;
    margin: 15px 0;
    text-decoration: underline;
  }
  .info-section {
    margin-bottom: 15px;
  }
  .info-line {
    margin-bottom: 8px;
    display: flex;
    align-items: baseline;
  }
  .info-label {
    font-weight: bold;
    min-width: 120px;
    margin-right: 10px;
  }
  .info-value {
    flex: 1;
    border-bottom: 1px dotted #000;
    min-height: 16px;
    padding-bottom: 2px;
  }
  .paragraph {
    text-align: justify;
    margin-bottom: 15px;
    line-height: 1.4;
  }
  .indent {
    margin-left: 30px;
  }
  .signature-section {
    margin-top: 30px;
    display: flex;
    justify-content: space-between;
  }
  .signature-box {
    text-align: center;
    width: 200px;
  }
  .signature-title {
    font-weight: bold;
    margin-bottom: 50px;
    text-decoration: underline;
  }
  .amount-box {
    border: 2px solid #000;
    padding: 10px;
    margin: 10px 0;
    text-align: center;
    font-weight: bold;
  }
  .dotted-line {
    border-bottom: 1px dotted #000;
    display: inline-block;
    min-width: 200px;
    margin: 0 5px;
  }
  .checkbox {
    display: inline-block;
    width: 14px;
    height: 14px;
    border: 2px solid #000;
    margin-right: 5px;
    vertical-align: middle;
    background: white;
  }
  .checkbox.checked::after {
    content: "✓";
    font-size: 11px;
    font-weight: bold;
    line-height: 10px;
  }
  @media print {
    body { margin: 0; }
    .no-print { display: none; }
    .page { page-break-after: always; }
    .page:last-child { page-break-after: auto; }
  }
`;
