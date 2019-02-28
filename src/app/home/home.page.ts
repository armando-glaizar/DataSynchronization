import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Network } from '@ionic-native/network/ngx';
import * as firebase from 'firebase';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  ref = firebase.database().ref();
  survey_form: FormGroup;
  surveys: any = [];
  
  genders = ["Masculino", "Femenino"];
  occupations = ["Profesionista", "Técnico", "Estudiante"];
  cities = ["Acacoyagua","Acala","Acapetahua","Altamirano","Amatán","Amatenango de la Frontera","Amatenango del Valle","Angel Albino Corzo","Jaltenango de la Paz (Angel Albino Corzo)","Arriaga","Bejucal de Ocampo","Bella Vista","Berriozábal","Bochil","El Bosque","Cacahoatán","Catazajá","Cintalapa","Cintalapa de Figueroa","Coapilla","Comitán de Domínguez","La Concordia","Copainalá","Chalchihuitán","Chamula","Chanal","Chapultenango","Chenalhó","Chiapa de Corzo","Chiapilla","Chicoasén","Chicomuselo","Chilón","Escuintla","Francisco León","Rivera el Viejo Carmen","Frontera Comalapa","Frontera Hidalgo","La Grandeza","Huehuetán","Huixtán","Huitiupán","Huixtla","La Independencia","Ixhuatán","Ixtacomitán","Ixtapa","Ixtapangajoya","Jiquipilas","Jitotol","Juárez","Larráinzar","La Libertad","Mapastepec","Las Margaritas","Mazapa de Madero","Mazatán","Metapa","Metapa de Domínguez","Mitontic","Motozintla","Motozintla de Mendoza","Nicolás Ruíz","Ocosingo","Ocotepec","Ocozocoautla de Espinosa","Ostuacán","Osumacinta","Oxchuc","Palenque","Pantelhó","Pantepec","Pichucalco","Pijijiapan","El Porvenir","El Porvenir de Velasco Suárez","Villa Comaltitlán","Pueblo Nuevo Solistahuacán","Rayón","Reforma","Las Rosas","Sabanilla","Salto de Agua","San Cristóbal de las Casas","San Fernando","Siltepec","Simojovel","Simojovel de Allende","Sitalá","Socoltenango","Solosuchiapa","Soyaló","Suchiapa","Suchiate","Ciudad Hidalgo","Sunuapa","Tapachula","Tapachula de Córdova y Ordóñez","Tapalapa","Tapilula","Tecpatán","Tenejapa","Teopisca","Tila","Tonalá","Totolapa","La Trinitaria","Tumbalá","Tuxtla Gutiérrez","Tuxtla Chico","Tuzantán","Tzimol","Unión Juárez","Venustiano Carranza","Villa Corzo","Villaflores","Yajalón","San Lucas","Zinacantán","San Juan Cancuc","Aldama","Benemérito de las Américas","Maravilla Tenejapa","Marqués de Comillas","Zamora Pico de Oro","Montecristo de Guerrero","San Andrés Duraznal","Santiago el Pinar"];

  constructor(private formBuilder: FormBuilder, private network: Network, public toast: ToastController) {
    network.onConnect().subscribe(() => {
      if(this.network.type === "wifi" && localStorage.getItem("surveys")) {
        this.sync_surveys();
      }
    });
    
    if(this.network.type === "wifi" && localStorage.getItem("surveys")) {
      this.sync_surveys();
    }
  }

  ngOnInit() {
    this.survey_form = this.formBuilder.group({
      'name': ['', Validators.required],
      'years': ['', Validators.required],
      'gender': ['', Validators.required],
      'occupation': ['', Validators.required],
      'city': ['', Validators.required]
    });
  }

  sync_surveys() {
    this.presentToast("Sincronizando")
    this.surveys = JSON.parse(localStorage.getItem("surveys"));
    
    for(let survey of this.surveys) {
      let save = this.ref.push();
      save.set(survey);
    }

    localStorage.clear();
  }

  save_survey() {
    if(this.network.type === "wifi" || this.network.type === "4g") {
      let save = this.ref.push();
      save.set(this.survey_form.value);
      this.presentToast("Encuesta enviada exitosamente");
    }
    else {
      if(localStorage.getItem("surveys")) {
        this.surveys = JSON.parse(localStorage.getItem("surveys"))
        this.surveys[this.surveys.length] = this.survey_form.value;
      }
      else {
        this.surveys[0] = this.survey_form.value;
      }
      
      localStorage.setItem("surveys", JSON.stringify(this.surveys));
      this.presentToast("Encuesta almacenada exitosamente");
    }
  }

  async presentToast(message: string) {
    const toast = await this.toast.create({
      message: message,
      duration: 5000
    });
    toast.present();
  }
}
