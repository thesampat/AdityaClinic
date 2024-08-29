const getCategoryCounts = (dataset, key) => {
    let valuesAll = dataset.reduce((acc, patient) => {
        const ivalue = patient?.[key];
        acc[ivalue] = (acc[ivalue] || 0) + 1;
        return acc;
    }, {});

    const dataArray = Object.entries(valuesAll).map(([state, value]) => ({ state, value }));
    dataArray.sort((a, b) => b.value - a.value);
    let top10 = dataArray.slice(0, 10)


    let ObjectKeys = top10?.map(e => e.state)
    let ObjectValues = top10?.map(e => e.value)

    return { data: ObjectValues, labels: ObjectKeys };
};


const getAllAgeGroups = (dataset, dobKey) => {
    const currentDate = new Date();
    const ageGroups = dataset?.reduce((acc, patient) => {
        const dob = patient?.[dobKey];
        if (dob) {
            const birthDate = new Date(dob);
            const age = currentDate.getFullYear() - birthDate.getFullYear();
            const ageGroup = getAgeGroupLabel(age);
            acc[ageGroup] = (acc[ageGroup] || 0) + 1;
        }
        return acc;
    }, {});

    const dataArray = Object.entries(ageGroups).map(([group, count]) => ({ group, count }));
    dataArray.sort((a, b) => b.count - a.count);

    const ObjectKeys = dataArray.map(e => e.group);
    const ObjectValues = dataArray.map(e => e.count);
    console.log(dataArray)

    return { data: ObjectValues, labels: ObjectKeys };
};

const getAgeGroupLabel = (age) => {
    if (age >= 0 && age <= 5) {
        return '0 - 5 Years';
    } else if (age > 5 && age <= 10) {
        return '5 - 10 Years';
    } else if (age > 10 && age <= 20) {
        return '10 - 20 Years';
    } else if (age > 20 && age <= 40) {
        return '20 - 40 Years';
    } else if (age > 40 && age <= 60) {
        return '40 - 60 Years';
    } else {
        return 'Unknown';
    }
};

const getDiagnosis = (dataset, subKey) => {
    let diagnosisCounts = dataset?.reduce((acc, patient) => {
        const subKeyValue = patient?.diagnosis?.[subKey];
        if (subKeyValue !== undefined) {
            acc[subKeyValue] = (acc[subKeyValue] || 0) + 1;
        }
        return acc;
    }, {});

    const dataArray = Object.entries(diagnosisCounts).map(([diagnosis, value]) => ({ diagnosis, value }));
    dataArray.sort((a, b) => b.value - a.value);
    let top10 = dataArray.slice(0, 10)

    let ObjectKeys = top10?.map(e => e.diagnosis)
    let ObjectValues = top10?.map(e => e.value)


    return { data: ObjectValues, labels: ObjectKeys };
};



const getTop10HighestPaidCustomers = (dataset) => {
    // Calculate total paid amount for each customer
    const customerTotalPaid = dataset.reduce((acc, prescription) => {
        const customerId = prescription?.patient;
        const paidAmount = prescription?.paid || 0;

        acc[customerId] = (acc[customerId] || 0) + paidAmount;

        return acc;
    }, {});

    // Convert customerTotalPaid to an array of objects
    const customerTotalPaidArray = Object.entries(customerTotalPaid).map(([customerId, totalPaid]) => ({
        customerId,
        totalPaid
    }));

    // Sort the array in descending order based on totalPaid
    customerTotalPaidArray.sort((a, b) => b.totalPaid - a.totalPaid);

    // Select the top 100 highest paying customers
    const top100HighestPayingCustomers = customerTotalPaidArray.slice(0, 10);

    // Extract labels (customer IDs) and data (total paid amounts) for the top 100 customers
    const labels = top100HighestPayingCustomers.map(customer => customer.customerId);
    const data = top100HighestPayingCustomers.map(customer => customer.totalPaid);

    // Return an object with data and labels
    return { data, labels };
};




export { getCategoryCounts, getAllAgeGroups, getDiagnosis, getTop10HighestPaidCustomers }