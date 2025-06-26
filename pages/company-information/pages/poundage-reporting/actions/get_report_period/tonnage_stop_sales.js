let stop_sale_dates = []
for (let stopsale of {{state.company_stop_sales}}) 
     if (stopsale.stop_sale_tonnage == 1) {
  stop_sale_dates.push({date: stopsale.created_date, detail_id: stopsale.detail_id})}
 	return stop_sale_dates