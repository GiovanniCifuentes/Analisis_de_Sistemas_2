const API_BASE = "https://localhost:7193/api/Analytics/embudo/resumen";

    let oportunidades = [];
    let resumenMetrics = null;

    // Carga vendedores únicos para filtro
    async function cargarVendedores() {
      try {
        const res = await fetch("https://localhost:7193/api/oportunidades");
        if (!res.ok) throw new Error("Error al obtener vendedores");
        const data = await res.json();

        const vendedores = [...new Set(data.map(o => o.vendedor))].sort();

        const select = document.getElementById("filterVendedor");
        vendedores.forEach(v => {
          const option = document.createElement("option");
          option.value = v;
          option.textContent = v;
          select.appendChild(option);
        });
      } catch (error) {
        mostrarError(error.message);
      }
    }

    // Solicitar resumen embudo al backend con filtros
    async function obtenerResumen(vendedor = "", desde = null, hasta = null) {
      try {
        let url = API_BASE;
        let params = [];

        if (vendedor && vendedor.trim() !== "" && vendedor !== "Todos") {
          params.push(`vendedor=${encodeURIComponent(vendedor)}`);
        }

        if (desde && !isNaN(new Date(desde))) {
          params.push(`desde=${new Date(desde).toISOString()}`);
        }
        
        if (hasta && !isNaN(new Date(hasta))) {
          params.push(`hasta=${new Date(hasta).toISOString()}`);
        }

        if (params.length > 0) {
          url += `?${params.join("&")}`;
        }

        console.log("URL de consulta:", url);

        const res = await fetch(url);
        if (!res.ok) {
          const texto = await res.text();
          console.error("Error en fetch resumen:", res.status, texto);
          throw new Error(`Error al obtener resumen: ${res.status} ${res.statusText}`);
        }
        
        const data = await res.json();
        console.log("Datos recibidos del backend:", data);
        
        resumenMetrics = data;
        oportunidades = await cargarOportunidades(vendedor, desde, hasta);
        
        return data;
        
      } catch (error) {
        mostrarError(error.message);
        return null;
      }
    }

    // Cargar oportunidades (detalles para kanban)
    async function cargarOportunidades(vendedor = "", desde = null, hasta = null) {
      try {
        let url = "https://localhost:7193/api/oportunidades";
        let params = [];
        
        if (vendedor && vendedor.trim() !== "" && vendedor !== "Todos") {
          params.push(`vendedor=${encodeURIComponent(vendedor)}`);
        }
        
        if (params.length > 0) {
          url += `?${params.join("&")}`;
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error("Error al obtener oportunidades");
        
        let data = await res.json();

        // Filtros adicionales por fecha
        if (desde) {
          const desdeDate = new Date(desde);
          data = data.filter(o => new Date(o.fechaCreacion) >= desdeDate);
        }
        if (hasta) {
          const hastaDate = new Date(hasta);
          data = data.filter(o => new Date(o.fechaCreacion) <= hastaDate);
        }

        return data;
      } catch(error) {
        mostrarError(error.message);
        return [];
      }
    }

    // Renderiza Kanban con las oportunidades
    function renderKanban(data) {
      const kanban = document.getElementById("kanban");
      kanban.innerHTML = "";

      if(data.length === 0) {
        kanban.textContent = "No hay oportunidades para mostrar.";
        return;
      }

      const etapas = [...new Set(data.map(o => o.etapa))].sort();

      etapas.forEach(etapa => {
        const col = document.createElement("div");
        col.className = "kanban-column";

        const h3 = document.createElement("h3");
        h3.textContent = etapa;
        col.appendChild(h3);

        const ops = data.filter(o => o.etapa === etapa);
        ops.forEach(oport => {
          const card = document.createElement("div");
          card.className = "opportunity";
          card.title = `Vendedor: ${oport.vendedor}\nValor: $${oport.valorEstimado.toLocaleString()}\nCierre Probable: ${new Date(oport.fechaCierreProbable).toLocaleDateString()}\nEstado: ${oport.estado}`;
          card.textContent = `${oport.titulo} - $${oport.valorEstimado.toLocaleString()}`;
          col.appendChild(card);
        });

        kanban.appendChild(col);
      });
    }

    function calcularTasaConversionTotal(metrics) {
      if (!metrics || metrics.length < 2) return 0;

      const primeraEtapa = metrics[0].cantidad;
      const ultimaEtapa = metrics[metrics.length - 1].cantidad;

      if (primeraEtapa === 0) return 0;

      return (ultimaEtapa / primeraEtapa) * 100;
    }

    function renderChartAndMetrics(metrics) {
      const ctx = document.getElementById('barChartCanvas').getContext('2d');
      const infoBoxes = document.getElementById('infoBoxes');
      
      // Verifica si metrics es el objeto contenedor con resumenPorEtapa
      if (metrics && metrics.resumenPorEtapa) {
        metrics = metrics.resumenPorEtapa;
      }

      // Verificación robusta de datos
      if (!metrics || !Array.isArray(metrics) || metrics.length === 0) {
        infoBoxes.textContent = "No hay datos válidos para mostrar.";
        
        if (window.embudoChart) {
          window.embudoChart.destroy();
          window.embudoChart = null;
        }
        return;
      }

      // Asegurar que todas las propiedades necesarias existan
      const datosNormalizados = metrics.map(item => ({
        etapa: item.etapa || 'Desconocido',
        valorTotal: item.valorTotal || 0,
        cantidad: item.cantidad || 0,
        tasaConversion: item.tasaConversion || 0,
        tasaGanada: item.tasaGanada || 0,
        cuelloBotella: item.cuelloBotella || false
      }));

      // Datos para el gráfico
      const etapas = datosNormalizados.map(m => m.etapa);
      const valores = datosNormalizados.map(m => m.valorTotal);
      const conversiones = datosNormalizados.map(m => m.tasaConversion);
      const colores = valores.map((v, i) => 
        i < datosNormalizados.length - 1 ? 'rgba(54, 162, 235, 0.7)' : 'rgba(75, 192, 192, 0.7)'
      );

      if (window.embudoChart) {
        window.embudoChart.data.labels = etapas;
        window.embudoChart.data.datasets[0].data = valores;
        window.embudoChart.update();
      } else {
        window.embudoChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: etapas,
            datasets: [{
              label: 'Valor Total por Etapa',
              data: valores,
              backgroundColor: colores,
              borderColor: colores.map(c => c.replace('0.7', '1')),
              borderWidth: 1,
              yAxisID: 'y'
            }, {
              label: 'Tasa Conversión (%)',
              data: conversiones,
              backgroundColor: 'rgba(255, 159, 64, 0.2)',
              borderColor: 'rgba(255, 159, 64, 1)',
              borderWidth: 1,
              type: 'line',
              yAxisID: 'y1'
            }]
          },
          options: {
            responsive: true,
            plugins: {
              tooltip: {
                callbacks: {
                  label: function(context) {
                    let label = context.dataset.label || '';
                    if (label) label += ': ';
                    if (context.datasetIndex === 0) {
                      label += '$' + context.raw.toLocaleString();
                    } else {
                      label += context.raw.toFixed(2) + '%';
                    }
                    return label;
                  }
                }
              },
              legend: {
                position: 'top',
              }
            },
            scales: {
              y: {
                type: 'linear',
                display: true,
                position: 'left',
                title: {
                  display: true,
                  text: 'Valor ($)'
                }
              },
              y1: {
                type: 'linear',
                display: true,
                position: 'right',
                min: 0,
                max: 100,
                title: {
                  display: true,
                  text: 'Conversión (%)'
                },
                grid: {
                  drawOnChartArea: false
                }
              }
            }
          }
        });
      }

      const tasaTotal = calcularTasaConversionTotal(datosNormalizados);
      const valorPrevisto = datosNormalizados.reduce((sum, m) => sum + (m.valorTotal * (m.tasaGanada / 100)), 0);
      
      infoBoxes.innerHTML = `
        <p><strong>Tasa Conversión Total:</strong> ${tasaTotal.toFixed(2)}%</p>
        <p><strong>Valor Previsto (con probabilidad):</strong> $${valorPrevisto.toLocaleString('es-ES', {maximumFractionDigits: 2})}</p>
        <p><strong>Cuellos de Botella:</strong> ${datosNormalizados.filter(m => m.cuelloBotella).map(m => m.etapa).join(', ') || 'Ninguno'}</p>
      `;
    }

    function mostrarError(msg) {
      document.getElementById("error").textContent = msg;
    }

    function formatearFechaISO(fecha) {
      const d = new Date(fecha);
      return d.toISOString().split("T")[0];
    }

    function exportarCSV(metrics) {
      if(!metrics || metrics.length === 0) return alert("No hay datos para exportar.");
      let csv = "Etapa,Cantidad,ValorTotal\n";
      metrics.forEach(e => {
        csv += `"${e.etapa}",${e.cantidad},${e.valorTotal.toFixed(2)}\n`;
      });
      const blob = new Blob([csv], {type: "text/csv"});
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "embudo_oportunidades.csv";
      a.click();
      URL.revokeObjectURL(url);
    }

    async function iniciar() {
      await cargarVendedores();

      // Set fechas default
      const hoy = new Date();
      const hace30 = new Date();
      hace30.setDate(hoy.getDate() - 30);

      document.getElementById("filterDesde").value = formatearFechaISO(hace30);
      document.getElementById("filterHasta").value = formatearFechaISO(hoy);

      // Primera carga datos
      const vendedor = document.getElementById("filterVendedor").value;
      const desde = document.getElementById("filterDesde").value;
      const hasta = document.getElementById("filterHasta").value;

      const resumen = await obtenerResumen(vendedor, desde, hasta);
      
      if (!resumen) {
        mostrarError("No se pudieron cargar los datos");
        return;
      }

      // Usa resumen.resumenPorEtapa en lugar de ResumenPorEtapa
      const datosParaGrafico = resumen.resumenPorEtapa || resumen;
      
      if (!Array.isArray(datosParaGrafico)) {
        console.error("Datos recibidos:", resumen);
        mostrarError("Formato de datos inesperado");
        return;
      }

      renderKanban(oportunidades);
      renderChartAndMetrics(datosParaGrafico);

      // Event listeners...
      document.getElementById("btnFiltrar").addEventListener("click", async () => {
        const vendedor = document.getElementById("filterVendedor").value;
        const desde = document.getElementById("filterDesde").value;
        const hasta = document.getElementById("filterHasta").value;

        const resumen = await obtenerResumen(vendedor, desde, hasta);
        if (resumen) {
          const datos = resumen.resumenPorEtapa || resumen;
          renderKanban(oportunidades);
          renderChartAndMetrics(datos);
        }
      });

      document.getElementById("btnExportCsv").addEventListener("click", () => {
        if (resumenMetrics) {
          const datos = resumenMetrics.resumenPorEtapa || resumenMetrics;
          exportarCSV(datos);
        }
      });
    }

    window.onload = iniciar;