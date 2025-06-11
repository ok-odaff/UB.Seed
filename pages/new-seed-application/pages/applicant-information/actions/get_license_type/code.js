let is_retail = 0;
let is_wholesale = 0;
let is_medical_marijuana = 0;

switch (ui.AI_LicenseType.value) {
  case "is_retail" :
    is_retail = 1
    break;
    
  case "is_wholesale":
    is_wholesale = 1
    break;
    
  case "is_medical_marijuana":
    is_medical_marijuana = 1
    break;
}

return [is_retail, is_wholesale, is_medical_marijuana]