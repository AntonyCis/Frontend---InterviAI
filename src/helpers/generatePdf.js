import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export const generateInterviewPDF = async (interviewData, userName) => {
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const margin = 20
    const contentWidth = pageWidth - (margin * 2)
    let y = margin

    pdf.setFillColor(16, 185, 129)
    pdf.rect(0, 0, pageWidth, 40, 'F')

    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(24)
    pdf.setFont('helvetica', 'bold')
    pdf.text('InterviAI', margin, 20)

    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'normal')
    pdf.text('Reporte de Entrevista', margin, 30)

    y = 55

    pdf.setTextColor(51, 51, 51)
    pdf.setFontSize(16)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Informacion General', margin, y)
    y += 10

    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')

    const typeMap = {
        cv: 'Basada en CV',
        tech_stack: 'Enfoque Tecnico',
        soft_skills: 'Habilidades Blandas',
        job_link: 'Oferta Laboral'
    }

    const info = [
        [`ID: #${interviewData._id?.slice(-6).toUpperCase()}`, `Tipo: ${typeMap[interviewData.type] || interviewData.type}`],
        [`Fecha: ${new Date(interviewData.createdAt).toLocaleDateString('es-ES')}`, `Estado: ${interviewData.isCompleted ? 'Completada' : 'En progreso'}`],
        [`Candidato: ${userName || 'Usuario'}`, `Preguntas: ${interviewData.questions?.length || 0}`]
    ]

    info.forEach(row => {
        pdf.text(row[0], margin, y)
        pdf.text(row[1], margin + contentWidth / 2, y)
        y += 6
    })

    y += 10

    if (interviewData.isCompleted) {
        pdf.setFillColor(240, 253, 244)
        pdf.roundedRect(margin, y, contentWidth, 35, 3, 3, 'F')

        pdf.setTextColor(16, 185, 129)
        pdf.setFontSize(14)
        pdf.setFont('helvetica', 'bold')
        pdf.text('Puntuacion Final', margin + 10, y + 12)

        pdf.setFontSize(28)
        pdf.text(`${interviewData.averageScore}/10`, margin + 10, y + 25)

        const level = interviewData.averageScore >= 8 ? 'Senior/Expert' : interviewData.averageScore >= 5 ? 'Mid-Level' : 'Junior'
        pdf.setFontSize(10)
        pdf.setTextColor(107, 114, 128)
        pdf.text(`Nivel: ${level}`, margin + 60, y + 15)
        pdf.text(`Success Rate: ${Math.round(interviewData.averageScore * 10)}%`, margin + 60, y + 22)

        y += 45

        if (interviewData.overallFeedback) {
            pdf.setTextColor(51, 51, 51)
            pdf.setFontSize(14)
            pdf.setFont('helvetica', 'bold')
            pdf.text('Feedback General', margin, y)
            y += 8

            pdf.setFontSize(10)
            pdf.setFont('helvetica', 'italic')
            pdf.setTextColor(107, 114, 128)

            const feedbackLines = pdf.splitTextToSize(`"${interviewData.overallFeedback}"`, contentWidth - 10)
            pdf.text(feedbackLines, margin + 5, y)
            y += feedbackLines.length * 5 + 10
        }

        if (y > 250) {
            pdf.addPage()
            y = margin
        }

        pdf.setTextColor(51, 51, 51)
        pdf.setFontSize(14)
        pdf.setFont('helvetica', 'bold')
        pdf.text('Analisis por Pregunta', margin, y)
        y += 10

        interviewData.questions?.forEach((q, i) => {
            if (y > 260) {
                pdf.addPage()
                y = margin
            }

            const scoreColor = q.score >= 8 ? [16, 185, 129] : q.score >= 5 ? [245, 158, 11] : [239, 68, 68]

            pdf.setFillColor(249, 250, 251)
            pdf.roundedRect(margin, y, contentWidth, 8, 2, 2, 'F')

            pdf.setTextColor(51, 51, 51)
            pdf.setFontSize(10)
            pdf.setFont('helvetica', 'bold')
            pdf.text(`Pregunta ${i + 1}`, margin + 3, y + 5)

            pdf.setTextColor(...scoreColor)
            pdf.setFont('helvetica', 'bold')
            pdf.text(`${q.score}/10`, margin + contentWidth - 15, y + 5)

            y += 12

            pdf.setTextColor(51, 51, 51)
            pdf.setFontSize(9)
            pdf.setFont('helvetica', 'normal')
            const questionLines = pdf.splitTextToSize(q.questionText, contentWidth - 10)
            pdf.text(questionLines, margin + 3, y)
            y += questionLines.length * 4 + 3

            if (q.userAnswer && q.userAnswer !== 'No respondido') {
                pdf.setTextColor(107, 114, 128)
                pdf.setFontSize(8)
                pdf.setFont('helvetica', 'bold')
                pdf.text('Tu respuesta:', margin + 3, y)
                y += 4

                pdf.setFont('helvetica', 'normal')
                const answerLines = pdf.splitTextToSize(q.userAnswer, contentWidth - 15)
                pdf.text(answerLines, margin + 5, y)
                y += answerLines.length * 4 + 3
            }

            if (q.aiFeedback) {
                pdf.setTextColor(16, 185, 129)
                pdf.setFontSize(8)
                pdf.setFont('helvetica', 'bold')
                pdf.text('Feedback IA:', margin + 3, y)
                y += 4

                pdf.setFont('helvetica', 'italic')
                pdf.setTextColor(107, 114, 128)
                const feedbackLines = pdf.splitTextToSize(q.aiFeedback, contentWidth - 15)
                pdf.text(feedbackLines, margin + 5, y)
                y += feedbackLines.length * 4 + 6
            }

            y += 5
        })
    } else {
        pdf.setTextColor(107, 114, 128)
        pdf.setFontSize(12)
        pdf.text('Esta entrevista aun no ha sido completada.', margin, y)
        y += 10
        pdf.setFontSize(10)
        pdf.text('Completa la entrevista para ver el analisis detallado.', margin, y)
    }

    const pageCount = pdf.internal.pages.length - 1
    for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i)
        pdf.setFontSize(8)
        pdf.setTextColor(156, 163, 175)
        pdf.text(
            `InterviAI - Reporte generado el ${new Date().toLocaleDateString('es-ES')} - Pagina ${i} de ${pageCount}`,
            pageWidth / 2,
            pdf.internal.pageSize.getHeight() - 10,
            { align: 'center' }
        )
    }

    pdf.save(`Entrevista_${interviewData._id?.slice(-6).toUpperCase()}.pdf`)
}
