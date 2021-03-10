import { Component, OnInit } from '@angular/core';
import { HouseFeatures } from '../houseFeature';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import * as tf from '@tensorflow/tfjs';

@Component({
  selector: 'app-houseprice',
  templateUrl: './houseprice.component.html',
  styleUrls: ['./houseprice.component.css']
})
export class HousepriceComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    this.loadModel();

  }
  houseFeature: HouseFeatures = {
    area: '60076',
    houseType: 'SFH',
    rooms: 7,
    bedRooms: 3,
    bedRoomsBsmt: 0,
    fullBath: 2,
    halfBath: 0,
    approxSquFeet: 1200,
    garageType: 'attached',
    garageSpaces: 2,
    parkingSpaces: 0
  };

  //housePrice: Observable<string>;
  housePrice: string;
  tempPrice: string;

  setHousePrice(px: string) {
    console.log('val', px);
    this.housePrice
  }

  refreshPrice(): void {
    this.housePrice = this.tempPrice;
    //this.getPredictedPriceCall(this.housePrice);
  }

  getPredictedPrice(): void {
    this.housePrice = "0.0";
    this.getPredictedPriceCall(this.tempPrice);
  }

  getPredictedPriceCall(tempPrice): void {
    //this.housePrice = this.priceCalcService.getPrice(this.houseFeature);
    var k = this.getPrice(this.houseFeature);
    this.housePrice = k;
    //console.log('k is', k);
  }

  selectHouseType(value) {
    this.houseFeature.houseType = value;
  }

  selectHouseZipCode(value) {
    this.houseFeature.area = value;
  }

  houseTypes: string[] = ['SFH', 'Condo', 'Duplex', 'Townhouse'];
  houseZipCodes: string[] = ["60002", "60025", "60026", "60029", "60035", "60053", "60062", "60067", "60076", "60077", "60091", "60201", "60202", "60203", "60625", "60626", "60638", "63104"];

  // Load an existing tensorflow model, the model for house prices is
  // built using python and Tensorflow
  model: tf.LayersModel;

  async loadModel() {
    // Note that a URL is required - it should point to the
    // server that you are using to host the pages.
    const MODEL_URL = 'assets/model.json';

    this.model = await tf.loadLayersModel(MODEL_URL);
    console.log(this.model.summary());
  }



  // use the model to predict the price of a house given it's features
  getPrice(features: HouseFeatures): string {
    try {

      // Use tf.tidy() to clean up and unused tensors and be a good citizen
      var housePredictedPrice = tf.tidy(() => {
        // Get the features passed from the UI and convert them to a Javascript array
        var uiFeatures = this.getFeatureArray(features);

        // Tensorflow JS requires the features to be held in a 2D 
        // tensor (data, data shape)
        var inputFeatures = tf.tensor2d(uiFeatures, [1, 38]);

        // Predict the price
        var result = this.model.predict(inputFeatures) as tf.Tensor2D;

        // Note this is syncronous  see the .data() method for an async alternative
        var resultValue = result.dataSync()[0];

        // Scale and round the result - the model was trained with 
        // price in millions
        resultValue = resultValue * 1000000;
        resultValue = Math.round(resultValue / 10000) * 10000;


        return resultValue;
      });

      return housePredictedPrice.toString();

    }
    catch (e) {
      console.log(e);
    }
  }

  // Take a featue object populated in the UI and convert it
  // to a feature array
  // Uses inline Json for the example, the data used to train the model
  // Had a set of zip codes and property types one hot encoded
  getFeatureArray(f: HouseFeatures): Array<number> {
    var featureMapJson = '{"SFH":0,"Condo":1,"Duplex":2,"Townhouse":3,"New":4,"Recent":5,"20A":6,' +
      '"19A":7,"19B":8,"19C":9,"19D":10,"Pre1900":11,"Area":12,"Rooms":13,"FullBaths":14,"HalfBaths":15,' +
      '"BsmtBth":16,"Beds":17,"BsmtBeds":18,"GarageSpaces":19, "60002":20,"60025":21,"60026":22,"60029":23,' +
      '"60035":24,"60053":25,"60062":26,"60067":27,"60076":28,"60077":29,"60091":30,"60201":31,' +
      '"60202":32,"60203":33,"60625":34,"60626":35,"60638":36,"63104":37}';

    //console.log(featureMapJson);

    var featureMap = JSON.parse(featureMapJson);
    var features = Array(38).fill(0);
    this.setFeature(featureMap, features, f.area, 1);
    this.setFeature(featureMap, features, f.houseType, 1);
    this.setFeature(featureMap, features, "Rooms", f.rooms);
    this.setFeature(featureMap, features, "Beds", f.bedRooms);
    this.setFeature(featureMap, features, "BsmtBeds", f.bedRoomsBsmt);
    this.setFeature(featureMap, features, "FullBaths", f.fullBath);
    this.setFeature(featureMap, features, "HalfBaths", f.halfBath);
    this.setFeature(featureMap, features, "Area", f.approxSquFeet / 1000);
    this.setFeature(featureMap, features, "GarageSpaces", f.garageSpaces);

    return features;
  }

  setFeature(featureMap, features: Array<number>, name: string, value: number) {
    var featureIndex = featureMap[name];
    features[featureIndex] = value;
  }



}
