import { mergeMap as _observableMergeMap, catchError as _observableCatch } from 'rxjs/operators';
import { Observable, throwError as _observableThrow, of as _observableOf } from 'rxjs';
import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpResponseBase } from '@angular/common/http';

import * as moment from 'moment';

import {
    API_BASE_URL,
    throwException,
    blobToText
} from '@shared/service-proxies/service-proxies';

@Injectable()
export class POServiceProxy {
    private http: HttpClient;
    private baseUrl: string;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    constructor(@Inject(HttpClient) http: HttpClient, @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
        this.http = http;
        this.baseUrl = baseUrl ? baseUrl : "";
    }

    getPOMasters(
        filter: string | undefined, 
        poFilter: string | undefined, 
        customerFilter: string | undefined, 
        warehouseFilter: string | undefined, 
        deliverToFilter: string | undefined,
        statusFilter: string | undefined,
        startDate: string | undefined, 
        endDate: string | undefined,
        sorting: string | undefined, 
        maxResultCount: number | undefined, 
        skipCount: number | undefined
        ): Observable<PagedResultDtoOfPOListDto> {
        let url_ = this.baseUrl + "/api/services/app/PO/GetPOListing?";
        if (filter !== undefined)
            url_ += "Filter=" + encodeURIComponent("" + filter) + "&"; 
        if (poFilter !== undefined)
            url_ += "POFilter=" + encodeURIComponent("" + poFilter) + "&"; 
        if (customerFilter !== undefined)
            url_ += "CustomerFilter=" + encodeURIComponent("" + customerFilter) + "&"; 
        if (warehouseFilter !== undefined)
            url_ += "WarehouseFilter=" + encodeURIComponent("" + warehouseFilter) + "&"; 
        if (deliverToFilter !== undefined)
            url_ += "DeliverToFilter=" + encodeURIComponent("" + deliverToFilter) + "&";
        if (statusFilter !== undefined)
            url_ += "StatusFilter=" + encodeURIComponent("" + statusFilter) + "&";
        if (startDate !== undefined)
            url_ += "StartDate=" + encodeURIComponent("" + startDate) + "&"; 
        if (endDate !== undefined)
            url_ += "EndDate=" + encodeURIComponent( "" + endDate) + "&"; 
        if (sorting === null)
            throw new Error("The parameter 'sorting' cannot be null.");
        else if (sorting !== undefined)
            url_ += "Sorting=" + encodeURIComponent("" + sorting) + "&"; 
        if (maxResultCount === null)
            throw new Error("The parameter 'maxResultCount' cannot be null.");
        else if (maxResultCount !== undefined)
            url_ += "MaxResultCount=" + encodeURIComponent("" + maxResultCount) + "&"; 
        if (skipCount === null)
            throw new Error("The parameter 'skipCount' cannot be null.");
        else if (skipCount !== undefined)
            url_ += "SkipCount=" + encodeURIComponent("" + skipCount) + "&"; 
        url_ = url_.replace(/[?&]$/, "");

        let options_ : any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Accept": "text/plain"
            })
        };

        return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processGetPOMasters(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetPOMasters(<any>response_);
                } catch (e) {
                    return <Observable<PagedResultDtoOfPOListDto>><any>_observableThrow(e);
                }
            } else
                return <Observable<PagedResultDtoOfPOListDto>><any>_observableThrow(response_);
        }));
    }

    protected processGetPOMasters(response: HttpResponseBase): Observable<PagedResultDtoOfPOListDto> {
        const status = response.status;
        const responseBlob = 
            response instanceof HttpResponse ? response.body : 
            (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = PagedResultDtoOfPOListDto.fromJS(resultData200);
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<PagedResultDtoOfPOListDto>(<any>null);
    }

    getPOMasterInfoById(id: number): Observable<POMasterDto> {
       let url_ = this.baseUrl + "/api/services/app/PO/GetPOInfoById?";
       if (id === null)
           throw new Error("The parameter 'Id' cannot be null.");
       else if (id !== undefined)
           url_ += "Id=" + encodeURIComponent("" + id) + "&"; 
        url_ = url_.replace(/[?&]$/, "");
      
       let options_ : any = {
           observe: "response",
           responseType: "blob",
           headers: new HttpHeaders({
               "Accept": "text/plain"
           })
       };

       return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_ : any) => {
           return this.processGetPOMasterInfoById(response_);
       })).pipe(_observableCatch((response_: any) => {
           if (response_ instanceof HttpResponseBase) {
               try {
                   return this.processGetPOMasterInfoById(<any>response_);
               } catch (e) {
                   return <Observable<POMasterDto>><any>_observableThrow(e);
               }
           } else
               return <Observable<POMasterDto>><any>_observableThrow(response_);
       }));
   }

   protected processGetPOMasterInfoById(response: HttpResponseBase): Observable<POMasterDto> {
       const status = response.status;
       const responseBlob = 
           response instanceof HttpResponse ? response.body : 
           (<any>response).error instanceof Blob ? (<any>response).error : undefined;

       let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
       if (status === 200) {
           return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
           let result200: any = null;
           let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
           result200 = POMasterDto.fromJS(resultData200);
           return _observableOf(result200);
           }));
       } else if (status !== 200 && status !== 204) {
           return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
           return throwException("An unexpected server error occurred.", status, _responseText, _headers);
           }));
       }
       return _observableOf<POMasterDto>(<any>null);
   }

   getPODetails(id: number | undefined, filter: string | undefined, sorting: string | undefined, maxResultCount: number | undefined, skipCount: number | undefined): Observable<PagedResultDtoOfPODetailsDto> {
       let url_ = this.baseUrl + "/api/services/app/PO/GetPODetailsById?";
       if (id === null)
           throw new Error("The parameter 'Id' cannot be null.");
       else if (id !== undefined)
           url_ += "Id=" + encodeURIComponent("" + id) + "&"; 
       if (filter !== undefined)
           url_ += "Filter=" + encodeURIComponent("" + filter) + "&"; 
       if (sorting === null)
           throw new Error("The parameter 'sorting' cannot be null.");
       else if (sorting !== undefined)
           url_ += "Sorting=" + encodeURIComponent("" + sorting) + "&"; 
       if (maxResultCount === null)
           throw new Error("The parameter 'maxResultCount' cannot be null.");
       else if (maxResultCount !== undefined)
           url_ += "MaxResultCount=" + encodeURIComponent("" + maxResultCount) + "&"; 
       if (skipCount === null)
           throw new Error("The parameter 'skipCount' cannot be null.");
       else if (skipCount !== undefined)
           url_ += "SkipCount=" + encodeURIComponent("" + skipCount) + "&"; 
       url_ = url_.replace(/[?&]$/, "");

       let options_ : any = {
           observe: "response",
           responseType: "blob",
           headers: new HttpHeaders({
               "Accept": "text/plain"
           })
       };

       return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_ : any) => {
           return this.processGetPODetails(response_);
       })).pipe(_observableCatch((response_: any) => {
           if (response_ instanceof HttpResponseBase) {
               try {
                   return this.processGetPODetails(<any>response_);
               } catch (e) {
                   return <Observable<PagedResultDtoOfPODetailsDto>><any>_observableThrow(e);
               }
           } else
               return <Observable<PagedResultDtoOfPODetailsDto>><any>_observableThrow(response_);
       }));
   }

   protected processGetPODetails(response: HttpResponseBase): Observable<PagedResultDtoOfPODetailsDto> {
       const status = response.status;
       const responseBlob = 
           response instanceof HttpResponse ? response.body : 
           (<any>response).error instanceof Blob ? (<any>response).error : undefined;

       let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
       if (status === 200) {
           return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
           let result200: any = null;
           let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
           result200 = PagedResultDtoOfPODetailsDto.fromJS(resultData200);
           return _observableOf(result200);
           }));
       } else if (status !== 200 && status !== 204) {
           return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
           return throwException("An unexpected server error occurred.", status, _responseText, _headers);
           }));
       }
       return _observableOf<PagedResultDtoOfPODetailsDto>(<any>null);
   }

   getPODetailsByPoNo(poNo: string | undefined): Observable<PODetailListDto> {
      let url_ = this.baseUrl + "/api/services/app/PO/GetPODetailsByPONo?";
      if (poNo === null)
          throw new Error("The parameter 'poNo' cannot be null.");
      else if (poNo !== undefined)
          url_ += "poNo=" + encodeURIComponent("" + poNo) + "&"; 
       url_ = url_.replace(/[?&]$/, "");
     
      let options_ : any = {
          observe: "response",
          responseType: "blob",
          headers: new HttpHeaders({
              "Accept": "text/plain"
          })
      };

      return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_ : any) => {
          return this.processGetPODetailsByPONo(response_);
      })).pipe(_observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
              try {
                  return this.processGetPODetailsByPONo(<any>response_);
              } catch (e) {
                  return <Observable<PODetailListDto>><any>_observableThrow(e);
              }
          } else
              return <Observable<PODetailListDto>><any>_observableThrow(response_);
      }));
  }

  protected processGetPODetailsByPONo(response: HttpResponseBase): Observable<PODetailListDto> {
      const status = response.status;
      const responseBlob = 
          response instanceof HttpResponse ? response.body : 
          (<any>response).error instanceof Blob ? (<any>response).error : undefined;

      let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
      if (status === 200) {
          return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
          let result200: any = null;
          let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
          result200 = PODetailListDto.fromJS(resultData200);
          return _observableOf(result200);
          }));
      } else if (status !== 200 && status !== 204) {
          return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
          return throwException("An unexpected server error occurred.", status, _responseText, _headers);
          }));
      }
      
      return _observableOf<PODetailListDto>(<any>null);
  }

   getPODetailListByPONo(poNo: string | undefined, filter: string | undefined, sorting: string | undefined, maxResultCount: number | undefined, skipCount: number | undefined): Observable<PagedResultDtoOfPODetailsDto> {
       let url_ = this.baseUrl + "/api/services/app/PO/GetPODetailListByPONo?";
       if (poNo === null)
           throw new Error("The parameter 'PONo' cannot be null.");
       else if (poNo !== undefined)
           url_ += "PONo=" + encodeURIComponent("" + poNo) + "&"; 
       if (filter !== undefined)
           url_ += "Filter=" + encodeURIComponent("" + filter) + "&"; 
       if (sorting === null)
           throw new Error("The parameter 'sorting' cannot be null.");
       else if (sorting !== undefined)
           url_ += "Sorting=" + encodeURIComponent("" + sorting) + "&"; 
       if (maxResultCount === null)
           throw new Error("The parameter 'maxResultCount' cannot be null.");
       else if (maxResultCount !== undefined)
           url_ += "MaxResultCount=" + encodeURIComponent("" + maxResultCount) + "&"; 
       if (skipCount === null)
           throw new Error("The parameter 'skipCount' cannot be null.");
       else if (skipCount !== undefined)
           url_ += "SkipCount=" + encodeURIComponent("" + skipCount) + "&"; 
       url_ = url_.replace(/[?&]$/, "");

       let options_ : any = {
           observe: "response",
           responseType: "blob",
           headers: new HttpHeaders({
               "Accept": "text/plain"
           })
       };

       return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_ : any) => {
           return this.processGetPODetails(response_);
       })).pipe(_observableCatch((response_: any) => {
           if (response_ instanceof HttpResponseBase) {
               try {
                   return this.processGetPODetails(<any>response_);
               } catch (e) {
                   return <Observable<PagedResultDtoOfPODetailsDto>><any>_observableThrow(e);
               }
           } else
               return <Observable<PagedResultDtoOfPODetailsDto>><any>_observableThrow(response_);
       }));
   }
}

export class PagedResultDtoOfPOListDto implements IPagedResultDtoOfPOListDto {
    totalCount!: number;
    items!: POMasterDto[] | undefined;

    constructor(data?: IPagedResultDtoOfPOListDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.totalCount = data["totalCount"];
            if (Array.isArray(data["items"])) {
                this.items = [] as any;
                for (let item of data["items"])
                    this.items!.push(POMasterDto.fromJS(item));
            }
        }
    }

    static fromJS(data: any): PagedResultDtoOfPOListDto {
        data = typeof data === 'object' ? data : {};
        let result = new PagedResultDtoOfPOListDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["totalCount"] = this.totalCount;
        if (Array.isArray(this.items)) {
            data["items"] = [];
            for (let item of this.items)
                data["items"].push(item.toJSON());
        }
        return data; 
    }
}

export interface IPagedResultDtoOfPOListDto {
    totalCount: number;
    items: POMasterDto[] | undefined;
}

export class POMasterDto implements IPOMasterDto {
    poNo!: string | undefined;
    customerId!: string | undefined;
    warehouseId!: string | undefined;
    organizationId!: string | undefined;
    poStatus!: string | undefined;
    orderedQty!: number;
    expectedArriveTime1!: moment.Moment | undefined;
    lastModificationTime!: moment.Moment | undefined;
    lastModifierUserId!: number | undefined;
    creationTime!: moment.Moment;
    creatorUserId!: number | undefined;
    udf01?: string | undefined;
    id!: number;

    constructor(data?: IPOMasterDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.poNo = data["poNo"];
            this.customerId = data["customerId"];
            this.warehouseId = data["warehouseId"];
            this.organizationId = data["organizationId"];
            this.poStatus = data["poStatus"];
            this.orderedQty = data["orderedQty"];
            this.expectedArriveTime1 = data["expectedArriveTime1"] ? moment(data["expectedArriveTime1"].toString()) : <any>undefined;
            this.lastModificationTime = data["lastModificationTime"] ? moment(data["lastModificationTime"].toString()) : <any>undefined;
            this.lastModifierUserId = data["lastModifierUserId"];
            this.creationTime = data["creationTime"] ? moment(data["creationTime"].toString()) : <any>undefined;
            this.creatorUserId = data["creatorUserId"];
            this.udf01 = data["udf01"];
            this.id = data["id"];
        }
    }

    static fromJS(data: any): POMasterDto {
        data = typeof data === 'object' ? data : {};
        let result = new POMasterDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["poNo"] = this.poNo;
        data["customerId"] = this.customerId;
        data["warehouseId"] = this.warehouseId;
        data["organizationId"] = this.organizationId;
        data["poStatus"] = this.poStatus;
        data["orderedQty"] = this.orderedQty;
        data["expectedArriveTime1"] = this.expectedArriveTime1 ? this.expectedArriveTime1.toISOString() : <any>undefined;
        data["lastModificationTime"] = this.lastModificationTime ? this.lastModificationTime.toISOString() : <any>undefined;
        data["lastModifierUserId"] = this.lastModifierUserId;
        data["creationTime"] = this.creationTime ? this.creationTime.toISOString() : <any>undefined;
        data["creatorUserId"] = this.creatorUserId;
        data["udf01"] = this.udf01;
        data["id"] = this.id;
        return data; 
    }
}

export interface IPOMasterDto {
    poNo: string | undefined;
    customerId: string | undefined;
    warehouseId: string | undefined;
    organizationId: string | undefined;
    poStatus: string | undefined;
    orderedQty: number;
    expectedArriveTime1: moment.Moment | undefined;
    lastModificationTime: moment.Moment | undefined;
    lastModifierUserId: number | undefined;
    creationTime: moment.Moment;
    creatorUserId: number | undefined;
    udf01?: string | undefined;
    id: number;
}


export class PagedResultDtoOfPODetailsDto implements IPagedResultDtoOfPODetailsDto {
    totalCount!: number;
    items!: PODetailDto[] | undefined;

    constructor(data?: IPagedResultDtoOfPODetailsDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.totalCount = data["totalCount"];
            if (Array.isArray(data["items"])) {
                this.items = [] as any;
                for (let item of data["items"])
                    this.items!.push(PODetailDto.fromJS(item));
            }
        }
    }

    static fromJS(data: any): PagedResultDtoOfPODetailsDto {
        data = typeof data === 'object' ? data : {};
        let result = new PagedResultDtoOfPODetailsDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["totalCount"] = this.totalCount;
        if (Array.isArray(this.items)) {
            data["items"] = [];
            for (let item of this.items)
                data["items"].push(item.toJSON());
        }
        return data; 
    }
}

export interface IPagedResultDtoOfPODetailsDto {
    totalCount: number;
    items: PODetailDto[] | undefined;
}

export class PODetailDto implements IPODetailDto {
    poNo!: string | undefined;
    poLineNo!: string | undefined;
    sku!: string | undefined;
    skuDescr!: string | undefined;
    orderedQty!: number;
    receivedQty!: number;
    openedQty!: number;
    shippedQty!: number;
    lotAtt01?: string | undefined;
    lastModificationTime!: moment.Moment | undefined;
    lastModifierUserId!: number | undefined;
    creationTime!: moment.Moment;
    creatorUserId!: number | undefined;
    id!: number;

    //extra
    isChecked!: boolean;
    originalReceivedQty!: number;

    constructor(data?: IPODetailDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.poNo = data["poNo"];
            this.poLineNo = data["poLineNo"];
            this.sku = data["sku"];
            this.skuDescr = data["skuDescr"];
            this.orderedQty = data["orderedQty"];
            this.receivedQty = data["receivedQty"];
            this.openedQty = data["openedQty"];
            this.shippedQty = data["shippedQty"];
            this.lotAtt01 = data["lotAtt01"];
            this.lastModificationTime = data["lastModificationTime"] ? moment(data["lastModificationTime"].toString()) : <any>undefined;
            this.lastModifierUserId = data["lastModifierUserId"];
            this.creationTime = data["creationTime"] ? moment(data["creationTime"].toString()) : <any>undefined;
            this.creatorUserId = data["creatorUserId"];
            this.id = data["id"];
        }
    }

    static fromJS(data: any): PODetailDto {
        data = typeof data === 'object' ? data : {};
        let result = new PODetailDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["poNo"] = this.poNo;
        data["poLineNo"] = this.poLineNo;
        data["sku"] = this.sku;
        data["skuDescr"] = this.skuDescr;
        data["orderedQty"] = this.orderedQty;
        data["receivedQty"] = this.receivedQty;
        data["openedQty"] = this.openedQty;
        data["shippedQty"] = this.shippedQty;
        data["lotAtt01"] = this.lotAtt01;
        data["lastModificationTime"] = this.lastModificationTime ? this.lastModificationTime.toISOString() : <any>undefined;
        data["lastModifierUserId"] = this.lastModifierUserId;
        data["creationTime"] = this.creationTime ? this.creationTime.toISOString() : <any>undefined;
        data["creatorUserId"] = this.creatorUserId;
        data["id"] = this.id;
        return data; 
    }
}

export interface IPODetailDto {
    poNo: string | undefined;
    poLineNo: string | undefined;
    sku: string | undefined;
    skuDescr: string | undefined;
    orderedQty: number;
    receivedQty: number;
    openedQty: number;
    shippedQty: number;
    lotAtt01?: string | undefined;
    lastModificationTime: moment.Moment | undefined;
    lastModifierUserId: number | undefined;
    creationTime: moment.Moment;
    creatorUserId: number | undefined;
    id: number;
}

export class PODetailListDto implements IPODetailListDto {
    items!: PODetailDto[] | undefined;

    constructor(data?: IPODetailListDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            if (Array.isArray(data["items"])) {
                this.items = [] as any;
                for (let item of data["items"])
                    this.items!.push(PODetailDto.fromJS(item));
            }
        }
    }

    static fromJS(data: any): PODetailListDto {
        data = typeof data === 'object' ? data : {};
        let result = new PODetailListDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        if (Array.isArray(this.items)) {
            data["items"] = [];
            for (let item of this.items)
                data["items"].push(item.toJSON());
        }
        return data; 
    }
}

export interface IPODetailListDto {
    items: PODetailDto[] | undefined;
}