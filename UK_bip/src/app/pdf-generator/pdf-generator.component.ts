// src/app/pdf-generator/pdf-generator.component.ts
import { Component } from '@angular/core';
import { ExcelReaderService } from '../excel-reader.service';
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-pdf-generator',
  templateUrl: './pdf-generator.component.html',
  styleUrls: ['./pdf-generator.component.css']
})
export class PdfGeneratorComponent {

  constructor(private excelReader: ExcelReaderService) { }

  async onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const data = await this.excelReader.readExcel(file);
      this.generatePDFs(data);
    }
  }

  async generatePDFs(data: any[]) {
    for (const item of data) {
      const pdfDoc = await PDFDocument.load(await fetch('/assets/modele_facture.pdf').then(res => res.arrayBuffer()));
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];

      firstPage.drawText(item['sender name and address'], { x: 100, y: 700 });
      // Ajoutez les autres champs comme nécessaire...

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      saveAs(blob, `facture_${item['invoice number']}.pdf`);
    }
  }
}
