package com.amindu.weather.weatherapp;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/weather")
@CrossOrigin(origins = "https://weather-app-puce-six-95.vercel.app/")
public class WeatherController {

    @Value("${API_KEY}")
    private String API_KEY;

    @GetMapping("/{city}")
    public WeatherResponse getWeather(@PathVariable String city) {
        try {
            String url = "https://api.openweathermap.org/data/2.5/weather?q=" + city +
                    "&appid=" + API_KEY + "&units=metric";
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

            JSONObject json = new JSONObject(response.getBody());

            String weather = json.getJSONArray("weather").getJSONObject(0).getString("main");
            double temperature = json.getJSONObject("main").getDouble("temp");
            double tempMin = json.getJSONObject("main").getDouble("temp_min");
            double tempMax = json.getJSONObject("main").getDouble("temp_max");

            return new WeatherResponse(city, weather, temperature, tempMin, tempMax);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "City not found!");
        }
    }

    public static class WeatherResponse {
        public String city;
        public String condition;
        public double temperature;
        public double tempMin;
        public double tempMax;

        public WeatherResponse(String city, String condition, double temperature, double tempMin, double tempMax) {
            this.city = city;
            this.condition = condition;
            this.temperature = temperature;
            this.tempMin = tempMin;
            this.tempMax = tempMax;
        }
    }
}
