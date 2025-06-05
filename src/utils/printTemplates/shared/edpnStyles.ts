
export const edpnStyles = `
  @page { 
    size: A4 portrait; 
    margin: 1.5cm; 
  }
  body { 
    font-family: 'Times New Roman', serif; 
    font-size: 10pt;
    line-height: 1.2;
    color: #000; 
    margin: 0;
    padding: 0;
  }
  .page {
    min-height: calc(100vh - 3cm);
  }
  .header {
    text-align: center;
    margin-bottom: 20px;
    border-bottom: 2px solid #000;
    padding-bottom: 10px;
  }
  .header h1 {
    font-size: 14pt;
    font-weight: bold;
    margin: 0;
    text-decoration: underline;
  }
  .header-info {
    display: flex;
    justify-content: space-between;
    margin: 15px 0;
    font-size: 9pt;
  }
  .header-left, .header-right {
    width: 45%;
  }
  .info-section {
    margin-bottom: 15px;
  }
  .info-row {
    display: flex;
    margin-bottom: 5px;
    align-items: baseline;
  }
  .info-label {
    font-weight: bold;
    min-width: 150px;
    margin-right: 10px;
  }
  .info-value {
    flex: 1;
    border-bottom: 1px dotted #000;
    min-height: 16px;
    padding-bottom: 2px;
  }
  .tableau-section {
    margin: 20px 0;
  }
  .tableau-title {
    font-weight: bold;
    text-align: center;
    margin-bottom: 10px;
    font-size: 11pt;
  }
  .tableau {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 15px;
  }
  .tableau th, .tableau td {
    border: 1px solid #000;
    padding: 5px;
    text-align: left;
    font-size: 9pt;
  }
  .tableau th {
    background-color: #f0f0f0;
    font-weight: bold;
    text-align: center;
  }
  .tableau .numeric {
    text-align: right;
  }
  .tableau .center {
    text-align: center;
  }
  .total-row {
    font-weight: bold;
    background-color: #f5f5f5;
  }
  .montant-box {
    border: 2px solid #000;
    padding: 8px;
    margin: 10px 0;
    text-align: center;
    font-weight: bold;
    font-size: 11pt;
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
  .date-lieu {
    text-align: right;
    margin: 20px 0;
    font-style: italic;
  }
  @media print {
    body { margin: 0; }
    .no-print { display: none; }
  }
`;
