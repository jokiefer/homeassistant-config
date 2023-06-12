import { LitElement, html} from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";

class MdtJalAktorDiag extends LitElement {
    
  static get properties() {
    return {
      hass: {},
      config: {},
    };
  }

  render(){
    //const entityId = this.config.entity;
    //const state = this.hass.states[entityId];
    const state = {
      state: "M1 S1 A150 E30"
    }
    
    const stateStr = state.state == "ERR: Date" ? '<ha-alert alert-type="error">Aktuelle Zeit ist unbekannt. Automatische Beschattung kann erst starten, wenn die Zeit bekannt ist.</ha-alert>' : state.state;

    const diagSplit = stateStr.split(" ");
    
    const mode = diagSplit[0].split("M")[1];

    const shadingReady = (mode[0] == "1");
    const shadingLocked = (mode[1] == "1");
    const outsideTempLocked = (mode[2] == "1");

    const threshold = diagSplit[1].split("S")[1];
    const thresholdOneExceeded = (threshold == "1" | threshold == "2");
    const thresholdTwoExceeded = (threshold == "2");

    const azimuth = parseInt(diagSplit[2].split("A")[1]);
    const altitude = parseInt(diagSplit[3].split("E")[1]);
    console.log(this.config);
    return html`
      <ha-card header="${this.config.title ? this.config.title : "Beschattung Diagnose"}">
        <div class="card-content">
          <ha-chip>
            <font color=${shadingReady ? "green": "yellow"}>
              <ha-icon icon="mdi:${shadingReady ? "hand-okay": "hand-back-left"}" />
            </font>
          </ha-chip>
          <ha-chip>
            <font color=${shadingLocked ? "red": "green"}>
              <ha-icon icon="mdi:${shadingLocked ? "lock": "lock-open-variant"}" />
            </font>
          </ha-chip>
          <ha-chip>
            <font color=${outsideTempLocked ? "red": "green"}>
              <ha-icon icon="mdi:thermometer-${outsideTempLocked ? "alert": "check"}" />
            </font>
          </ha-chip>
          <ha-chip>
            <ha-icon icon="mdi:sun-compass"/> 
            ${azimuth}°
          </ha-chip>
          <ha-chip>
            <ha-icon icon="mdi:sun-angle-outline"/> 
            ${altitude}°
          </ha-chip>
        </div>
      </ha-card>
    `;
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