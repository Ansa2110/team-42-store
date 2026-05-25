import { Component } from '@angular/core';
import { Header } from "./header/header";
import { Footer } from "./footer/footer";
import { RouterOutlet } from "../../../node_modules/@angular/router/types/_router_module-chunk";

@Component({
  selector: 'app-layout',
  imports: [Header, Footer],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {

}
