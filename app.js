const OWNER = "DianyDkcs";
const REPO = "BibliografiaStatisticDKCS";
const BRANCH = "main";
const PDF_FOLDER = "pdfs";

const apiUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PDF_FOLDER}?ref=${BRANCH}`;

const listaPDFs = document.getElementById("lista-pdfs");
const visorPDF = document.getElementById("visor-pdf");
const tituloPDF = document.getElementById("titulo-pdf");
const buscador = document.getElementById("buscador");

let archivosPDF = [];

async function cargarPDFs() {
  try {
    const respuesta = await fetch(apiUrl);

    if (!respuesta.ok) {
      throw new Error("No se pudo acceder a la carpeta de PDFs.");
    }

    const archivos = await respuesta.json();

    archivosPDF = archivos
      .filter(archivo => archivo.name.toLowerCase().endsWith(".pdf"))
      .map(archivo => ({
        nombre: archivo.name,
        titulo: limpiarNombre(archivo.name),
        url: archivo.download_url
      }));

    mostrarPDFs(archivosPDF);

  } catch (error) {
    listaPDFs.innerHTML = `
      <p class="error">
        No se pudieron cargar los PDFs. 
        Revisa que exista la carpeta "pdfs" y que tus archivos terminen en .pdf.
      </p>
    `;
  }
}

function mostrarPDFs(lista) {
  if (lista.length === 0) {
    listaPDFs.innerHTML = "<p>No hay archivos PDF en la carpeta.</p>";
    return;
  }

  listaPDFs.innerHTML = "";

  lista.forEach(pdf => {
    const tarjeta = document.createElement("div");
    tarjeta.className = "card";

    tarjeta.innerHTML = `
      <div class="icono">📘</div>
      <div class="nombre">${pdf.titulo}</div>
      <button type="button">Ver PDF</button>
      <a href="${pdf.url}" target="_blank" rel="noopener noreferrer">Abrir</a>
    `;

    tarjeta.querySelector("button").addEventListener("click", () => {
      tituloPDF.textContent = pdf.titulo;
      visorPDF.src = pdf.url;

      document.querySelector(".visor").scrollIntoView({
        behavior: "smooth"
      });
    });

    listaPDFs.appendChild(tarjeta);
  });
}

function limpiarNombre(nombreArchivo) {
  return nombreArchivo
    .replace(/\.pdf$/i, "")
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

buscador.addEventListener("input", () => {
  const texto = buscador.value.toLowerCase();

  const filtrados = archivosPDF.filter(pdf =>
    pdf.titulo.toLowerCase().includes(texto) ||
    pdf.nombre.toLowerCase().includes(texto)
  );

  mostrarPDFs(filtrados);
});

cargarPDFs();
