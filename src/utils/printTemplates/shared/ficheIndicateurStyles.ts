
export const ficheIndicateurStyles = `
  @page { 
    size: A4 portrait; 
    margin: 2cm; 
  }
  body { 
    font-family: 'Times New Roman', serif; 
    font-size: 12pt;
    line-height: 1.4;
    color: #000; 
    margin: 0;
    padding: 0;
  }
  .page {
    min-height: calc(100vh - 4cm);
  }
  .header {
    text-align: center;
    margin-bottom: 30px;
    border-bottom: 2px solid #000;
    padding-bottom: 15px;
  }
  .header h1 {
    font-size: 16pt;
    font-weight: bold;
    margin: 0;
    text-decoration: underline;
    text-transform: uppercase;
  }
  .header-info {
    display: flex;
    justify-content: space-between;
    margin: 20px 0;
    font-size: 11pt;
  }
  .header-left, .header-right {
    width: 45%;
  }
  .section {
    margin-bottom: 25px;
  }
  .section-title {
    font-weight: bold;
    font-size: 13pt;
    margin-bottom: 15px;
    text-decoration: underline;
    text-transform: uppercase;
  }
  .info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin-bottom: 20px;
  }
  .info-row {
    display: flex;
    margin-bottom: 8px;
    align-items: baseline;
  }
  .info-label {
    font-weight: bold;
    min-width: 180px;
    margin-right: 10px;
  }
  .info-value {
    flex: 1;
    border-bottom: 1px dotted #000;
    min-height: 20px;
    padding-bottom: 2px;
  }
  .full-width {
    grid-column: 1 / -1;
  }
  .tableau {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
  }
  .tableau th, .tableau td {
    border: 1px solid #000;
    padding: 8px;
    text-align: left;
    font-size: 11pt;
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
  .montant-box {
    border: 2px solid #000;
    padding: 10px;
    margin: 15px 0;
    text-align: center;
    font-weight: bold;
    font-size: 13pt;
    background-color: #f9f9f9;
  }
  .observations {
    margin: 20px 0;
    min-height: 80px;
  }
  .observations-content {
    border: 1px solid #000;
    padding: 10px;
    min-height: 60px;
    background-color: #fafafa;
  }
  .signature-section {
    margin-top: 40px;
    display: flex;
    justify-content: space-between;
  }
  .signature-box {
    text-align: center;
    width: 200px;
  }
  .signature-title {
    font-weight: bold;
    margin-bottom: 60px;
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
