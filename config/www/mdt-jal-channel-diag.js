class MdtJalChannelDiag extends HTMLElement {
    
    getStateStr(state){
      switch(state) {
        case 'Up':
          return 'Auffahrt';
        case 'Down':
          return 'Abfahrt';
        case 'absolut Pos':
          return 'absolute Position';
        case 'Scene':
          return 'Szenenaufruf';
        default:
          return '<ha-alert alert-type="success">Unbekannt</ha-alert>';
      }
    }
  
  
    // Whenever the state changes, a new `hass` object is set. Use this to
    // update your content.
    set hass(hass) {
      // Initialize the content if it's not there yet.
      if (!this.content) {
        this.innerHTML = `
          <ha-card header="Kanal Diagnose">
            <div class="card-content"></div>
          </ha-card>
        `;
        this.content = this.querySelector("div");
      }
  
      const entityId = this.config.entity;
      const state = hass.states[entityId];
      const stateStr = state ? getStateStr(state.state): '<ha-alert alert-type="success">Unbekannt</ha-alert>';

      
      

      this.content.innerHTML = `
        The state of ${entityId} is ${stateStr}!
      `;
    }
  
    // The user supplied configuration. Throw an exception and Home Assistant
    // will render an error card.
    setConfig(config) {
      if (!config.entity) {
        throw new Error("You need to define an entity");
      }
      this.config = config;
    }
  
    // The height of your card. Home Assistant uses this to automatically
    // distribute all cards over the available columns.
    getCardSize() {
      return 3;
    }
  }
  
  customElements.define("mdt-jal-channel-diag", MdtJalChannelDiag);