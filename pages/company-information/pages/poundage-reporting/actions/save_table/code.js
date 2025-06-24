let obj = {report_period: '', seed_types: [], fiscal_year: '', fiscal_quarter: ''};

obj.report_period =  {{state.report_periods.report_period}};
obj.fiscal_year = {{state.report_periods.fiscal_year}};
obj.fiscal_quarter = {{state.report_periods.fiscal_quarter}};

// Build ration/ton object array
for (let i = 0; i < {{state.seed_types}}.length; i++) {
  if ({{ui.seedTypesList.children[i].value.poundageInput}})
		obj.seed_types.push({category: {{state.seed_types}}[i], pounds: {{ui.seedTypesList.children[i].value.poundageInput}}});
 }

  {{state.seed_poundage.push(obj)}}
  ui.seedTypesList.resetValue();
  
return state.seed_poundage
