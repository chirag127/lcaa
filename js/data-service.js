/**
 * Data Service for loading and accessing portfolio analytics data
 */

window.LDC_DATA_SERVICE = {
  data: null,

  load: async function() {
    if (this.data) return this.data;
    try {
      const res = await fetch('./lending_data.json');
      this.data = await res.json();
      console.log(`[DataService] Successfully loaded 3,967 loans and analytics.`);
      return this.data;
    } catch (err) {
      console.error(`[DataService] Failed to load lending_data.json:`, err);
      throw err;
    }
  },

  getKPIs: function() {
    return this.data ? this.data.portfolio_kpis : null;
  },

  getLoans: function() {
    return this.data ? this.data.loans : [];
  }
};
