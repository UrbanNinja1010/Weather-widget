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
        fetch("https://urbanninja1010.github.io/Weather-widget/fun_weather_codes.json")
            .then(response => response.json())
            .then(translate => {
                // console.log(translate);
                translated_code = [];
                Monnes_mening = [];

                for (i = 0; i < code.length; i++) {
                    const index = translate.findIndex(element => element.Code == code[i]);
                    
                    const translation = translate[index];
                    translated_code[i] = translation ? translation["Description"] : index;


                    
                    const r =  Math.round(Math.random() * (translation["Comments"].length-1));
                    console.log(r, translation["Comments"].length);
                    Monnes_mening[i] = translation ? translation["Comments"][r] : "Monne: ik vind hier niks van";
                }

        // console.log(translated_code);
        // console.log(Monnes_mening);
        

        // current time rounded to 15 min
        current_time = new Date();
        current_time.setMilliseconds(0);
        
        current_time.setSeconds(0);
        current_time.setMinutes(Math.round(current_time.getMinutes() / 15) * 15);
        current_time = current_time.toLocaleTimeString('nl-NL').substr(0, 5);

        // lunch_index = time_axis_nodate.indexOf("12:00");
        lunch_index = time_axis_nodate.indexOf(current_time);



        
        lunch_temperature = temperature[lunch_index];
        lunch_rain = rain[lunch_index];
        lunch_code = translated_code[lunch_index];
        lunch_monne = Monnes_mening[lunch_index];

        document.getElementById("temp").innerText = `Temp: ${lunch_temperature} °C`;
        document.getElementById("rain").innerText = `Regen: ${lunch_rain} mm`;
        document.getElementById("code").innerText = `${lunch_code}.`;
        document.getElementById("monnes-mening").innerText = lunch_monne;
        document.getElementById("time").innerText = `Om ${current_time}`;

    });
});
