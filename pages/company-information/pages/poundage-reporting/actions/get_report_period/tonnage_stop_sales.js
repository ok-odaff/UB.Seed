let stop_sale_dates = []
for (let stopsale of {{state.company_stop_sales}}) 
     if (stopsale.stop_sale_tonnage == 1) {
  stop_sale_dates.push(stopsale.created_date)}
 	return stop_sale_dates