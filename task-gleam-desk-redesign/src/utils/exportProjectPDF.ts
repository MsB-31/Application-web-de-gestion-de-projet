import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Project, Task } from '../types';

const PRIORITY_LABEL: Record<string, string> = {
  HAUTE: 'Haute',
  MOYENNE: 'Moyenne',
  BASSE: 'Basse',
};

const STATUS_LABEL: Record<string, string> = {
  A_FAIRE: 'À faire',
  EN_COURS: 'En cours',
  TERMINE: 'Terminé',
};

const formatDate = (d?: string) =>
  d ? new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '—';

export function exportProjectPDF(project: Project, tasks: Task[]) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 15;

  // ── Header bar ──────────────────────────────────────────────────────────────
  doc.setFillColor(37, 99, 235); // primary blue
  doc.rect(0, 0, pageW, 32, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(project.nom, margin, 14);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Exporté le ${formatDate(new Date().toISOString())}`, margin, 22);

  const statutLabel = project.statut === 'ACTIF' ? 'Actif' : project.statut === 'EN_PAUSE' ? 'En pause' : 'Terminé';
  doc.text(`Statut : ${statutLabel}`, pageW - margin, 22, { align: 'right' });

  // ── Infos générales ─────────────────────────────────────────────────────────
  let y = 42;
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Informations générales', margin, y);

  y += 6;
  doc.setDrawColor(220, 220, 220);
  doc.line(margin, y, pageW - margin, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const infoRows = [
    ['Description', project.description || '—'],
    ['Date de début', formatDate(project.dateDebut)],
    ['Date de fin', formatDate(project.dateFin)],
    ['Membres', project.membres?.map(m => `${m.prenom} ${m.nom}`).join(', ') || '—'],
  ];

  infoRows.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(80, 80, 80);
    doc.text(`${label} :`, margin, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 30, 30);
    const lines = doc.splitTextToSize(value, pageW - margin - 55);
    doc.text(lines, margin + 40, y);
    y += 5.5 * lines.length;
  });

  // ── Statistiques ─────────────────────────────────────────────────────────────
  y += 4;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 30, 30);
  doc.text('Statistiques des tâches', margin, y);

  y += 6;
  doc.line(margin, y, pageW - margin, y);
  y += 6;

  const total = tasks.length;
  const aFaire = tasks.filter(t => t.statut === 'A_FAIRE').length;
  const enCours = tasks.filter(t => t.statut === 'EN_COURS').length;
  const termine = tasks.filter(t => t.statut === 'TERMINE').length;
  const progress = total > 0 ? Math.round((termine / total) * 100) : 0;

  const statsData = [
    ['Total', String(total)],
    ['À faire', String(aFaire)],
    ['En cours', String(enCours)],
    ['Terminées', String(termine)],
    ['Progression', `${progress}%`],
  ];

  // Mini stat boxes
  const boxW = (pageW - 2 * margin - 16) / 5;
  statsData.forEach(([label, val], i) => {
    const bx = margin + i * (boxW + 4);
    doc.setFillColor(245, 247, 255);
    doc.setDrawColor(220, 225, 240);
    doc.roundedRect(bx, y, boxW, 18, 2, 2, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(37, 99, 235);
    doc.text(val, bx + boxW / 2, y + 9, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 120);
    doc.text(label, bx + boxW / 2, y + 15, { align: 'center' });
  });
  y += 26;

  // Progress bar
  const barW = pageW - 2 * margin;
  doc.setFillColor(220, 225, 240);
  doc.roundedRect(margin, y, barW, 4, 2, 2, 'F');
  if (progress > 0) {
    doc.setFillColor(37, 99, 235);
    doc.roundedRect(margin, y, (barW * progress) / 100, 4, 2, 2, 'F');
  }
  y += 10;

  // ── Liste des tâches ─────────────────────────────────────────────────────────
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 30, 30);
  doc.text('Liste des tâches', margin, y);
  y += 4;

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [['Titre', 'Statut', 'Priorité', 'Assigné à', 'Échéance']],
    body: tasks.map(t => [
      t.titre,
      STATUS_LABEL[t.statut] ?? t.statut,
      PRIORITY_LABEL[t.priorite] ?? t.priorite,
      t.assigneA ? `${t.assigneA.prenom} ${t.assigneA.nom}` : '—',
      formatDate(t.dateEcheance),
    ]),
    headStyles: {
      fillColor: [37, 99, 235],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
    },
    bodyStyles: { fontSize: 8.5, textColor: [40, 40, 40] },
    alternateRowStyles: { fillColor: [246, 248, 255] },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { cellWidth: 28 },
      2: { cellWidth: 24 },
      3: { cellWidth: 36 },
      4: { cellWidth: 32 },
    },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 1) {
        const val = data.cell.raw as string;
        if (val === 'À faire') data.cell.styles.textColor = [202, 138, 4];
        else if (val === 'En cours') data.cell.styles.textColor = [37, 99, 235];
        else if (val === 'Terminé') data.cell.styles.textColor = [22, 163, 74];
      }
      if (data.section === 'body' && data.column.index === 2) {
        const val = data.cell.raw as string;
        if (val === 'Haute') data.cell.styles.textColor = [220, 38, 38];
        else if (val === 'Moyenne') data.cell.styles.textColor = [202, 138, 4];
        else data.cell.styles.textColor = [100, 100, 100];
      }
    },
  });

  // ── Footer ───────────────────────────────────────────────────────────────────
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    doc.setFontSize(7.5);
    doc.setTextColor(160, 160, 160);
    doc.text(
      `${project.nom} — Page ${p}/${pageCount}`,
      pageW / 2,
      doc.internal.pageSize.getHeight() - 8,
      { align: 'center' },
    );
  }

  doc.save(`${project.nom.replace(/\s+/g, '_')}_export.pdf`);
}
