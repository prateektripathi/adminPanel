const PDFDocument = require('pdfkit');

exports.generateInvoicePDF = (payment) => {
  return new Promise((resolve) => {
    const doc = new PDFDocument();
    const chunks = [];
    doc.on('data', (c) => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));

    doc.fontSize(20).text('Invoice', {align:'center'});
    doc.moveDown();
    doc.fontSize(12).text(`Invoice: ${payment.invoice || 'N/A'}`);
    doc.text(`Date: ${payment.date.toISOString().slice(0,10)}`);
    doc.text(`Customer: ${payment.userName || payment.user?.name}`);
    doc.moveDown();
    doc.text(`Amount: $${payment.amount}`);
    doc.moveDown();
    doc.text('Thank you for your payment.');
    doc.end();
  });
}
