
export const edpnStyles = `
  @page {
    size: A4;
    margin: 15mm;
  }

  body {
    font-family: 'Arial', sans-serif;
    font-size: 10px;
    line-height: 1.3;
    color: #000;
    margin: 0;
    padding: 0;
  }

  .page {
    width: 100%;
    max-width: 210mm;
    margin: 0 auto;
    background: white;
    padding: 8mm;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    border-bottom: 3px double #000;
    padding-bottom: 10px;
  }

  .header-logo {
    text-align: left;
    font-size: 11px;
    font-weight: bold;
  }

  .header h1 {
    font-size: 14px;
    font-weight: bold;
    margin: 0;
    text-transform: uppercase;
    text-decoration: underline;
    flex: 1;
    text-align: center;
  }

  .header-ministry {
    text-align: right;
    font-size: 10px;
    font-weight: bold;
  }

  .reference-section {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 15px;
  }

  .reference-box {
    flex: 1;
    border: 1px solid #000;
    padding: 8px;
    font-size: 9px;
  }

  .reference-box div {
    margin-bottom: 3px;
  }

  .section-title {
    font-size: 11px;
    font-weight: bold;
    text-transform: uppercase;
    margin: 15px 0 8px 0;
    padding: 5px;
    background-color: #f0f0f0;
    border-left: 4px solid #000;
  }

  .info-section {
    margin-bottom: 15px;
  }

  .info-row {
    display: flex;
    margin-bottom: 5px;
    padding: 3px 0;
    font-size: 9px;
  }

  .info-label {
    font-weight: bold;
    width: 180px;
    flex-shrink: 0;
  }

  .info-value {
    flex: 1;
    border-bottom: 1px dotted #999;
  }

  .calcul-section {
    margin-bottom: 15px;
  }

  .calcul-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 8px;
  }

  .calcul-table tr {
    border-bottom: 1px solid #ddd;
  }

  .calcul-table td {
    padding: 6px 8px;
    font-size: 10px;
  }

  .calcul-label {
    text-align: left;
    width: 60%;
  }

  .calcul-montant {
    text-align: right;
    width: 30%;
    font-family: 'Courier New', monospace;
  }

  .calcul-unit {
    text-align: left;
    width: 10%;
    padding-left: 5px;
  }

  .total-row {
    background-color: #e8f4f8;
    font-weight: bold;
    border-top: 2px solid #000;
  }

  .deduction-row {
    background-color: #fff5f5;
  }

  .net-row {
    background-color: #f0f8e8;
    font-weight: bold;
    border-top: 2px solid #000;
    border-bottom: 2px solid #000;
  }

  .tableau-section {
    margin-bottom: 15px;
  }

  .groupe-ayants {
    margin-bottom: 12px;
  }

  .groupe-ayants h3 {
    font-size: 10px;
    font-weight: bold;
    margin: 8px 0 5px 0;
    padding: 3px 8px;
    background-color: #f8f9fa;
    border-left: 3px solid #333;
  }

  .tableau {
    width: 100%;
    border-collapse: collapse;
    font-size: 9px;
  }

  .tableau th,
  .tableau td {
    border: 1px solid #333;
    padding: 5px 6px;
    text-align: left;
  }

  .tableau th {
    background-color: #e8e8e8;
    font-weight: bold;
    text-align: center;
    font-size: 9px;
  }

  .tableau td {
    font-size: 9px;
  }

  .tableau .center {
    text-align: center;
  }

  .tableau .numeric {
    text-align: right;
    font-family: 'Courier New', monospace;
  }

  .tableau .subtotal-row {
    background-color: #f8f9fa;
    font-weight: bold;
    border-top: 2px solid #666;
  }

  .tableau .total-row {
    background-color: #e8f4f8;
    font-weight: bold;
    border-top: 2px solid #000;
    border-bottom: 2px solid #000;
  }

  .total-general {
    margin-top: 10px;
  }

  .verification-section {
    margin: 15px 0;
    padding: 10px;
    border: 1px solid #000;
  }

  .verification-item {
    padding: 5px;
    margin-bottom: 5px;
    font-size: 10px;
  }

  .verification-item.ok {
    background-color: #d4edda;
    color: #155724;
  }

  .verification-item.erreur {
    background-color: #f8d7da;
    color: #721c24;
  }

  .erreurs-list {
    margin-top: 8px;
    padding: 8px;
    background-color: #fff3cd;
    border-left: 3px solid #ffc107;
    font-size: 9px;
  }

  .observations-section {
    margin: 15px 0;
  }

  .observations-content {
    border: 1px solid #999;
    padding: 10px;
    min-height: 40px;
    font-size: 9px;
    background-color: #fafafa;
  }

  .footer-info {
    margin: 20px 0;
    text-align: right;
    font-size: 10px;
    font-style: italic;
  }

  .signature-section {
    display: flex;
    justify-content: space-between;
    margin-top: 30px;
    page-break-inside: avoid;
  }

  .signature-box {
    text-align: center;
    width: 30%;
  }

  .signature-title {
    font-weight: bold;
    margin-bottom: 5px;
    font-size: 9px;
    text-transform: uppercase;
  }

  .signature-line {
    border-bottom: 1px solid #000;
    margin: 50px 10px 5px 10px;
  }

  .signature-name {
    font-size: 9px;
    font-style: italic;
    margin-top: 3px;
  }

  @media print {
    body { 
      margin: 0; 
    }
    .no-print { 
      display: none; 
    }
  }
`;
