api_link = "https://api.open-meteo.com/v1/forecast?latitude=51.79776957724414&longitude=5.256986342438848&minutely_15=temperature_2m,precipitation,weather_code&timezone=Europe%2FBerlin&forecast_days=1&models=best_match"

fetch(api_link)
    .then(response => response.json())
    .then(data => {
        // console.log("time:", data.minutely_15.time);
        time_axis = data.minutely_15.time;
        time_axis_nodate = [];
        for (i = 0; i < time_axis.length; i++) {
            time_axis_nodate[i] = time_axis[i].split("T")[1];
        }

        temperature = data.minutely_15.temperature_2m;
        rain = data.minutely_15.precipitation;
        code = data.minutely_15.weather_code;


        // translate weather code according to weather_codes.json
        fetch("fun_weather_codes.json")
            .then(response => response.json())
            .then(translate => {
                console.log(translate);
                translated_code = [];
                Monnes_mening = [];
                for (i = 0; i < code.length; i++) {
                    const translation = translate[code[i]];
                    translated_code[i] = translation ? translation["Description"] : code[i];
                    Monnes_mening[i] = translation ? translation["Comment"] : code[i];
                }

        console.log(translated_code);
        console.log(Monnes_mening);

        lunch_index = time_axis_nodate.indexOf("12:00");
        
        lunch_temperature = temperature[lunch_index];
        lunch_rain = rain[lunch_index];
        lunch_code = translated_code[lunch_index];
        lunch_monne = Monnes_mening[lunch_index];

        document.getElementById("temp").innerText = `Temp: ${lunch_temperature} °C`;
        document.getElementById("rain").innerText = `Er valt ${lunch_rain} mm regen.`;
        document.getElementById("code").innerText = `De weersomstandigheden om 12:00 zijn ${lunch_code}.`;
        document.getElementById("monnes-mening").innerText = lunch_monne;
        
    });
});
