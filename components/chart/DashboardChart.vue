<script setup>
import { Bar } from "vue-chartjs";
import ChartDataLabels from "chartjs-plugin-datalabels";

import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
} from "chart.js";

ChartJS.register(
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
    ChartDataLabels
);

const createGradient = (color1, color2) => {
    const ctx = document.createElement("canvas").getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, 0, 200);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    return gradient;
};

const labelDescriptions = {
    0: "Monday",
    1: "Tuesday",
    2: "Wednesday",
    3: "Thrusday",
    4: "Friday",
    5: "Saturday",
    6: "Sunday",
};

const chartData = ref({
    labels: ["M", "T", "W", "T", "F", "S", "S"],
    datasets: [
        {
            label: "",
            backgroundColor: createGradient("#A7F9FB", "#27AAE1"),
            borderWidth: 1,
            data: [120, 64, 64, 80, 100, 150, 75],
            borderRadius: {
                topLeft: 100,
                topRight: 100,
            },
        },
    ],
});

const chartOptions = ref({
    responsive: true,
    layout: {
        padding: {
            top: 20,
        },
    },
    scales: {
        x: {
            display: true,
            grid: {
                display: false, // Hide x-axis grid lines
            },
            ticks: {
                font: {
                    size: 12,
                    weight: "bold",
                },
            },
        },
        y: {
            display: false,
            beginAtZero: true,
            grid: {
                display: false, // Hide y-axis grid lines
            },
            ticks: {
                font: {
                    size: 10,
                    weight: "normal",
                },
                color: "black",
            },
        },
    },
    indexAxis: "x",
    barPercentage: 0.7,
    categoryPercentage: 0.6,
    plugins: {
        datalabels: {
            display: true,
            color: "black", // Set the color of the data labels
            anchor: "end", // Position the labels at the end of the bars
            align: "end", // Align the labels to the top of the bars
            offset: 5,
            formatter: (value) => value + "g",
            font: {
                size: 10,
                weight: "normal",
            },
            padding: {
                top: 10,
                bottom: -10,
            },
        },
        legend: {
            display: false,
            labels: {
                usePointStyle: true,
                font: {
                    size: 14,
                },
            },
            position: "bottom",
        },
        tooltip: {
            callbacks: {
                title: function ([context]) {
                    return labelDescriptions[context.dataIndex];
                },
            },
        },
    },
});
</script>

<template>
    <div class="w-[100%] h-full min-h-48 flex justify-center items-center">
        <Bar v-if="!loading" :options="chartOptions" :data="chartData" />
        <div class="flex justify-center items-center" v-else>
            <MoonLoader :loading="loading" :color="'#004b7c'"></MoonLoader>
        </div>
    </div>
</template>
