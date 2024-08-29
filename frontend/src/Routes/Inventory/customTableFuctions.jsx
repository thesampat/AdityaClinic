const getHeadings = (sectionType) => {
  let main_head;
  let custom_head;
  switch (sectionType) {
    case 'inventory':
      main_head = ['nameOfMedicine', 'potencyOrPower', 'quantity', 'mrp', 'discount'];
      custom_head = ['name', 'power', 'quantity', 'mrp', 'discount'];
      break;

    case 'Distributors':
      main_head = ['companyName', 'address', 'ownerName', 'phone', 'email'];
      custom_head = ['Company Name', 'address', 'owner', 'phone', 'email'];
      break;

    // Orders
    case 'Order':
      main_head = ['Order_Id', 'nameOfMedicine', 'company', 'potencyOrPower', 'quantity', 'typeOfMedicine'];
      custom_head = ['Order Id', 'Medicine Name', 'Company', 'Power', 'Qty', 'Type'];
      break;

    case 'Returns':
      main_head = ['order', 'damage', 'date'];
      custom_head = ['Order', 'damage', 'date'];
      break;

    case 'medicines':
      main_head = ['nameOfMedicine', 'company', 'potencyOrPower', 'quantity', 'typeOfMedicine'];
      custom_head = ['Medicine Name', 'Company', 'Power', 'Qty', 'Type'];
      break;
  }

  return { main: main_head, display: custom_head };
};

export { getHeadings };
