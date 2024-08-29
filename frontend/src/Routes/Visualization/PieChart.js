import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { getCategoryCounts } from './chartsFunctions';

const PieChart = ({ field, patientData, title }) => {
    const [pieChartData, setPieChartData] = useState({
        labels: '',
        datasets: [
            {
                data: '',
                backgroundColor: ['rgba(75,192,192,1)', '#50AF95', '#f3ba2f', '#2a71d0'],
                borderColor: 'black',
                borderWidth: 2,
            },
        ],
    });

    useEffect(() => {
        if (patientData !== null) {
            let { data, labels } = getCategoryCounts(patientData, field);
            setPieChartData((prev) => ({
                ...prev,
                labels: labels,
                datasets: [{ ...prev?.datasets, data: data }],
            }));
        }
    }, [patientData]);

    return (
        <div className="flex justify-center items-center h-full">
            <Pie
                data={pieChartData}
                options={{
                    plugins: {
                        title: {
                            display: true,
                            text: title,
                        },
                    },
                    layout: {
                        padding: {
                            left: 10,
                            right: 10,
                            top: 10,
                            bottom: 50,
                        },
                    },
                    maintainAspectRatio: false,
                }}
                height={200} // Adjust the height as needed
                width={200} // Adjust the width as needed
            />
        </div>
    );
};

export default PieChart;
