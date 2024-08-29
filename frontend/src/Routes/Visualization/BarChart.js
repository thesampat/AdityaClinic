import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { getCategoryCounts } from './chartsFunctions';


const BarChart = ({ field, patientData, title, graphfun = getCategoryCounts }) => {
    const [barChartData, setBarChartData] = useState({
        labels: '',
        datasets: [
            {
                label: '',
                data: '',
                backgroundColor: ['rgba(75,192,192,1)', '#50AF95', '#f3ba2f', '#2a71d0'],
                borderColor: 'black',
                borderWidth: 2,
            },
        ],
    });


    useEffect(() => {
        if (patientData !== null) {
            let { data, labels } = graphfun(patientData, field);
            setBarChartData((prev) => ({ ...prev, labels: labels, datasets: [{ ...prev?.datasets, data: data, label: title }] }));
        }

    }, [patientData]);


    field == 'primary' && console.log(barChartData)


    return (
        <Bar
            data={barChartData}
            options={{
                plugins: {
                    title: {
                        display: true,
                        text: barChartData?.datasets?.[0]?.label,
                    },
                },
            }}
        />
    )
}

export default BarChart