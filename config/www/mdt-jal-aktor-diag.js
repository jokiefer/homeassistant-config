import { LitElement, html} from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";

class MdtJalAktorDiag extends LitElement {
    
  static get properties() {
    return {
      hass: {},
      config: {},
    };
  }

  dec2bin(dec) {
    const bin = (dec >>> 0).toString(2);

    if (bin.length == 1) {
      return "00" + bin;
    } else if (bin.length == 2) {
      return "0" + bin;
    } else {
      return bin
    }
  }

  parseDiagText(diagText){

    if (diagText == "ERR: Date"){
      return {
        dateError: true
      }
    }

    const diagSplit = diagText.split(" ");
    
    const mode = diagSplit[0].split("M")[1];
    const binMode = this.dec2bin(parseInt(mode));
    const shadingReady = (binMode[2] == "1");
    const shadingLocked = (binMode[1] == "1");
    const outsideTempLocked = (binMode.startsWith("1"));

    const threshold = diagSplit[1].split("S")[1];
    const thresholdOneExceeded = (threshold == "1" | threshold == "2");
    const thresholdTwoExceeded = (threshold == "2");

    const azimuth = parseInt(diagSplit[2].split("A")[1]);
    const altitude = parseInt(diagSplit[3].split("E")[1]);

    return {
      dateError: false,
      shadingReady: shadingReady,
      shadingLocked: shadingLocked,
      outsideTempLocked: outsideTempLocked,
      thresholdOneExceeded: thresholdOneExceeded,
      thresholdTwoExceeded: thresholdTwoExceeded,
      azimuth: azimuth,
      altitude: altitude
    }
  }

  getDefaultCard(diagParsed){
    return html`
      <ha-card header="${this.config.title ? this.config.title : "Beschattung Diagnose"}">
        <div class="card-content">
          <ha-chip title="${diagParsed.shadingReady? "Beschattung ist betriebsbereit": "Beschattung ist nicht betriebsbereit"}">
            <font color=${diagParsed.shadingReady ? "green": "yellow"}>
              <ha-icon icon="mdi:${diagParsed.shadingReady ? "hand-okay": "hand-back-left"}" ></ha-icon> 
            </font>
          </ha-chip>
          <ha-chip title="${diagParsed.shadingLocked? "Beschattung ist gesperrt": "Beschattung ist nicht gesperrt"}">
            <font color=${diagParsed.shadingLocked ? "red": "green"}>
              <ha-icon icon="mdi:${shadingLocked ? "lock": "lock-open-variant"}" ></ha-icon> 
            </font>
          </ha-chip>
          <ha-chip title="${diagParsed.outsideTempLocked ? "Außentemperatursperre aktiv": "keine Außentemperatursperre aktiv"}">
            <font color=${diagParsed.outsideTempLocked ? "red": "green"}>
              <ha-icon icon="mdi:thermometer-${outsideTempLocked ? "alert": "check"}" ></ha-icon> 
            </font>
          </ha-chip>
          <ha-chip title="${diagParsed.thresholdTwoExceeded ? "Helligkeitsschwellwert 2 überschritten": diagParsed.thresholdOneExceeded ? "Helligkeitsschwellwert 1 überschritten": "Helligkeitsschwellwert nicht überschritten"}">
            <font color=${diagParsed.thresholdOneExceeded ? "green" : "red"}>
              <ha-icon icon="mdi:brightness-5"></ha-icon>
            </font>
          </ha-chip>
          <ha-chip title="Sonnenwinkel: ${azimuth}°">
            <ha-icon icon="mdi:sun-compass"></ha-icon>  
            ${diagParsed.azimuth}°
          </ha-chip>
          <ha-chip title="Sonnenhöhe: ${altitude}°">
            <ha-icon icon="mdi:sun-angle-outline"></ha-icon> 
            ${diagParsed.altitude}°
          </ha-chip>
        </div>
      </ha-card>
    `;
  }

  render(){
    const entityId = this.config.entity;
    const state = this.hass.states[entityId];
    if (!state){
        return html`
          <ha-card header="${this.config.title ? this.config.title : "Beschattung Diagnose"}">
            <div class="card-content">
            <ha-alert alert-type="warning">  
              Entity state is unavailable
            </ha-alert>
            </div>
          </ha-card>
        `;
    }
      
    const diagParsed = parseDiagText(state.state)

    if (diagParsed.dateError){
      return html`<ha-alert alert-type="error">Aktuelle Zeit ist unbekannt. Automatische Beschattung kann erst starten, wenn die Zeit dem Aktor bekannt ist.</ha-alert>`
    }

    return getDefaultCard(diagParsed);
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error("You need to define an entity");
    } 
     
    this.config = config;
  }

  getCardSize() {
    return this.config.entities.length + 1;
  }
}

customElements.define("mdt-jal-aktor-diag", MdtJalAktorDiag);