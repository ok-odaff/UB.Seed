let obj = {report_period: '', seed_types: [], fiscal_year: '', fiscal_quarter: ''};

// Build ration/ton object array
for (let i = 0; i < {{state.seed_types}}.length; i++) {
  if ({{ui.seedTypesList.children[i].value.poundageInput}})
		obj.seed_types.push({category: {{state.seed_types}}[i], pounds: {{ui.seedTypesList.children[i].value.poundageInput}}});
 }
//console.log({{state.report_periods[0]}})
obj.report_period = {{state.report_periods[0].toString()}}
  {{state.seed_poundage.push(obj)}}
  ui.seedTypesList.resetValue();
  
return state.seed_poundage
