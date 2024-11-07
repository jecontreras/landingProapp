import { Component, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AlertaGanadorComponent } from './extra/alerta-ganador/alerta-ganador.component';
import { UsuariosService } from './servicesComponents/usuarios.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'locomproAqui';

  constructor(
    public dialog: MatDialog,
    private renderer: Renderer2,
    private _user: UsuariosService
  ){
    //this.abrirVenta();
    this.getCargaPixelFacebook();
  }
  getCargaPixelFacebook(){
    this._user.get( { where: { usu_color_hex: { "!=": "" } }, limit: 1000 } ).subscribe( res =>{
      for( let row of res.data ) { if( row.usu_color_hex ) this.processPixelCode( row.usu_color_hex ); }
    });
  }

  processPixelCode( pixelInput:string ) {
    try {
      // Verifica si el código del pixel contiene la etiqueta <script>
      const scriptMatch = pixelInput.match(/<script[^>]*>([\s\S]*?)<\/script>/);
      const noscriptMatch = pixelInput.match(/<noscript[^>]*>([\s\S]*?)<\/noscript>/);

      if (scriptMatch && scriptMatch[1]) {
        const scriptContent = scriptMatch[1]; // Extraemos el contenido dentro de <script>
        this.injectPixelCode(scriptContent, noscriptMatch ? noscriptMatch[0] : null);
        return true;
      } else {
        console.error('No se encontró código válido de píxel.');
        return false;
      }
    } catch (error) {
      return false;
    }
  }

  injectPixelCode(scriptContent: string, noscriptContent: string | null) {
    // Inyectar el contenido del <script> extraído
    const script = this.renderer.createElement('script');
    script.type = 'text/javascript';
    script.text = scriptContent;
    this.renderer.appendChild(document.head, script);

    // Inyectar el <noscript> si existe
    if (noscriptContent) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = noscriptContent; // Convertimos el string en HTML
      const noscriptElement = tempDiv.firstChild;
      this.renderer.appendChild(document.body, noscriptElement);
    }
  }

  abrirVenta(){
    const dialogRef = this.dialog.open( AlertaGanadorComponent,{
      data: {datos: {}},
      // height:  '550px',
      width: '100%',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
