import { Component, OnInit } from '@angular/core';
import { HouseFeatures } from '../houseFeature';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import * as tf from '@tensorflow/tfjs';
import { HousePricePreditionService } from '../house-price-predition.service';

@Component({
  selector: 'app-houseprice',
  templateUrl: './houseprice.component.html',
  styleUrls: ['./houseprice.component.css']
})
export class HousepriceComponent implements OnInit {

  constructor(private priceService: HousePricePreditionService) { }

  ngOnInit(): void {
    this.getFeatureTypes();

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

  /*
  getPredictedPrice(): void {
    this.housePrice = "0.0";
    this.getPredictedPriceCall(this.tempPrice);
  }
  */

  getPredictedPrice(): void {
    //this.housePrice = this.priceCalcService.getPrice(this.houseFeature);
    var k = this.priceService.getPrice(this.houseFeature);
    this.housePrice = k;
    //console.log('k is', k);
  }

  selectHouseType(value) {
    this.houseFeature.houseType = value;
  }

  selectHouseZipCode(value) {
    this.houseFeature.area = value;
  }

  // used to show available House Types and Zip Codes
  houseTypes: string[] = [];
  houseZipCodes: string[] = [];

  getFeatureTypes(): void {
    this.houseTypes = this.priceService.houseTypes;
    this.houseZipCodes = this.priceService.houseZipCodes;

  }




}
