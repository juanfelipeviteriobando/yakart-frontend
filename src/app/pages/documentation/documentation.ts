import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
selector: 'app-documentation',
standalone: true,
imports: [CommonModule],
template: `
<div class="card" style="background-color:#ffe9f3;">
    <div class="font-semibold text-2xl mb-4 text-pink-600">Preguntas Frecuentes – Yakart Porcelanicrón</div>

    <div class="font-semibold text-xl mb-4 text-pink-500">¿Qué es Yakart?</div>
    <p class="text-lg mb-4">
        Yakart es una tienda especializada en productos y kits de porcelanicrón diseñados para creativos,
        aficionados al modelado y amantes de las manualidades. Todo con un estilo dulce, suave y pastel.
    </p>

    <div class="font-semibold text-xl mb-4 text-pink-500">¿Hacen envíos?</div>
    <p class="text-lg mb-4">
        ¡Sí! Realizamos envíos a todo el país. Cada pedido se empaca con mucho cariño
        para que llegue en perfectas condiciones a tu hogar.
    </p>

    <div class="font-semibold text-xl mb-4 text-pink-500">¿Qué formas de pago aceptan?</div>
    <p class="text-lg mb-4">
        Aceptamos pagos con tarjeta, transferencias bancarias y billeteras digitales.  
        Muy pronto añadiremos más opciones para tu comodidad.
    </p>

    <div class="font-semibold text-xl mb-4 text-pink-500">¿El porcelanicrón es apto para principiantes?</div>
    <p class="text-lg mb-4">
        ¡Totalmente! Nuestros kits incluyen instrucciones súper fáciles de seguir.  
        Además, en Yakart creemos que la creatividad es para todos, sin importar la experiencia.
    </p>

    <div class="font-semibold text-xl mb-4 text-pink-500">¿Ofrecen cursos o tutoriales?</div>
    <p class="text-lg mb-4">
        Sí, contamos con tutoriales gratuitos y también talleres especiales.  
        Puedes consultarlos en nuestra sección de cursos dentro de la web Yakart.
    </p>

    <div class="font-semibold text-xl mb-4 text-pink-500">¿Puedo personalizar un pedido?</div>
    <p class="text-lg mb-4">
        ¡Claro! Si deseas una figura personalizada, solo debes escribirnos.  
        Nuestro equipo estará feliz de ayudarte a crear algo único y adorable.
    </p>

    <div class="font-semibold text-xl mb-4 text-pink-500">¿Qué hago si mi pedido llega dañado?</div>
    <p class="text-lg mb-4">
        No te preocupes, en Yakart cuidamos mucho la calidad.  
        Escríbenos con fotos del problema y te ayudaremos a reemplazar o resolver la situación cuanto antes.
    </p>

</div>
`,
styles: `
    @media screen and (max-width: 991px) {
        .video-container {
            position: relative;
            width: 100%;
            height: 0;
            padding-bottom: 56.25%;

            iframe {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            }
        }
    }
`
})
export class Documentation {}