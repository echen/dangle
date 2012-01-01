var tangle;

function setUpTangle() {

	tangle = new Tangle(document.body, {
	  		
		initialize: function () {
			this.sharpe = sharpes[sharpes.length / 2];
		},
		
		update: function () {
			var i = 0;
			var j = 0;
			var alpha = 0;
			
			if (this.sharpe !== this._sharpe) {						
				i = sharpes.indexOfGreatestLessThan(this.sharpe);
				j = sharpes.indexOfLeastGreaterThan(this.sharpe);
				alpha = (sharpes[i] == sharpes[j]) ? 0 : ((this.sharpe - sharpes[i]) / (sharpes[j] - sharpes[i]));
			}
			if (this.chinchilla !== this._chinchilla) {
				i = chinchillas.indexOfGreatestLessThan(this.chinchilla);
				j = chinchillas.indexOfLeastGreaterThan(this.chinchilla);
				alpha = (chinchillas[i] == chinchillas[j]) ? 0 : ((this.chinchilla - chinchillas[i]) / (chinchillas[j] - chinchillas[i]));				
			}
			if (this.mortalityRate !== this._mortalityRate) {
				i = mortalityRates.indexOfGreatestLessThan(this.mortalityRate);
				j = mortalityRates.indexOfLeastGreaterThan(this.mortalityRate);
				alpha = (mortalityRates[i] == mortalityRates[j]) ? 0 : ((this.mortalityRate - mortalityRates[i]) / (mortalityRates[j] - mortalityRates[i]));
			}
			if (this.cost !== this._cost) {
				i = costs.indexOfGreatestLessThan(this.cost);
				j = costs.indexOfLeastGreaterThan(this.cost);
				alpha = (costs[i] == costs[j]) ? 0 : ((this.cost - costs[i]) / (costs[j] - costs[i]));				
			}
			
			if (i < 0) {
			  i = 0;
			}
			if (j < 0) {
			  j = 0;
			}
			if (alpha < 0) {
			  alpha = 0;
			}
			
			interpolate = function(x, y, alpha) {
			  return x + alpha * (y - x);
			}

			this.sharpe = this._sharpe = interpolate(sharpes[i], sharpes[j], alpha);
			this.chinchilla = this._chinchilla = interpolate(chinchillas[i], chinchillas[j], alpha);
			this.mortalityRate = this._mortalityRate = interpolate(mortalityRates[i], mortalityRates[j], alpha);
			this.cost = this._cost = interpolate(costs[i], costs[j], alpha);

			d3.selectAll("circle")
	      .attr("r", 1);

			d3.selectAll("circle[index='" + i + "']")
        .attr("r", 5);
		}
	});
}