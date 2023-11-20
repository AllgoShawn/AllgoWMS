import { mergeMap as _observableMergeMap, catchError as _observableCatch } from 'rxjs/operators';
import { Observable, throwError as _observableThrow, of as _observableOf } from 'rxjs';
import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpResponseBase } from '@angular/common/http';

import * as moment from 'moment';

import {
    API_BASE_URL,
    throwException,
    blobToText,
    PagedResultDtoOfNameValueDto
} from '@shared/service-proxies/service-proxies';

@Injectable()
export class TransferOrderServiceProxy {
    private http: HttpClient;
    private baseUrl: string;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    constructor(@Inject(HttpClient) http: HttpClient, @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
        this.http = http;
        this.baseUrl = baseUrl ? baseUrl : "";
    }

    getOrderMasters(
        filter: string | undefined, 
        orderNoFilter: string | undefined, 
        transferFromFilter: string | undefined, 
        transferToFilter: string | undefined, 
        statusFilter: string | undefined,
        startDate: string | undefined,
        endDate: string | undefined,
        sorting: string | undefined, 
        maxResultCount: number | undefined, 
        skipCount: number | undefined
    ): Observable<PagedResultDtoOfTransferOrderListDto> {
        let url_ = this.baseUrl + "/api/services/app/TransferOrder/GetTransferOrderListing?";
        if (filter !== undefined)
            url_ += "Filter=" + encodeURIComponent("" + filter) + "&"; 
        if (orderNoFilter !== undefined)
            url_ += "OrderNoFilter=" + encodeURIComponent("" + orderNoFilter) + "&"; 
        if (transferFromFilter !== undefined)
            url_ += "TransferFromFilter=" + encodeURIComponent("" + transferFromFilter) + "&"; 
        if (transferToFilter !== undefined)
            url_ += "TransferToFilter=" + encodeURIComponent("" + transferToFilter) + "&"; 
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
            return this.processGetTransferOrderMasters(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetTransferOrderMasters(<any>response_);
                } catch (e) {
                    return <Observable<PagedResultDtoOfTransferOrderListDto>><any>_observableThrow(e);
                }
            } else
                return <Observable<PagedResultDtoOfTransferOrderListDto>><any>_observableThrow(response_);
        }));
    }

    protected processGetTransferOrderMasters(response: HttpResponseBase): Observable<PagedResultDtoOfTransferOrderListDto> {
        const status = response.status;
        const responseBlob = 
            response instanceof HttpResponse ? response.body : 
            (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = PagedResultDtoOfTransferOrderListDto.fromJS(resultData200);
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<PagedResultDtoOfTransferOrderListDto>(<any>null);
    }

    getTransferOrderMasterInfoById(id: number): Observable<TransferOrderMasterDto> {
       let url_ = this.baseUrl + "/api/services/app/TransferOrder/GetTransferOrderInfoById?";
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
           return this.processGetTransferOrderMasterInfoById(response_);
       })).pipe(_observableCatch((response_: any) => {
           if (response_ instanceof HttpResponseBase) {
               try {
                   return this.processGetTransferOrderMasterInfoById(<any>response_);
               } catch (e) {
                   return <Observable<TransferOrderMasterDto>><any>_observableThrow(e);
               }
           } else
               return <Observable<TransferOrderMasterDto>><any>_observableThrow(response_);
       }));
   }

   protected processGetTransferOrderMasterInfoById(response: HttpResponseBase): Observable<TransferOrderMasterDto> {
       const status = response.status;
       const responseBlob = 
           response instanceof HttpResponse ? response.body : 
           (<any>response).error instanceof Blob ? (<any>response).error : undefined;

       let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
       if (status === 200) {
           return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
           let result200: any = null;
           let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
           result200 = TransferOrderMasterDto.fromJS(resultData200);
           return _observableOf(result200);
           }));
       } else if (status !== 200 && status !== 204) {
           return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
           return throwException("An unexpected server error occurred.", status, _responseText, _headers);
           }));
       }
       return _observableOf<TransferOrderMasterDto>(<any>null);
   }

   getTransferOrderDetails(id: number | undefined, filter: string | undefined, sorting: string | undefined, maxResultCount: number | undefined, skipCount: number | undefined): Observable<PagedResultDtoOfTransferOrderDetailsDto> {
       let url_ = this.baseUrl + "/api/services/app/TransferOrder/GetTransferOrderDetailsById?";
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
           return this.processGetTransferOrderDetails(response_);
       })).pipe(_observableCatch((response_: any) => {
           if (response_ instanceof HttpResponseBase) {
               try {
                   return this.processGetTransferOrderDetails(<any>response_);
               } catch (e) {
                   return <Observable<PagedResultDtoOfTransferOrderDetailsDto>><any>_observableThrow(e);
               }
           } else
               return <Observable<PagedResultDtoOfTransferOrderDetailsDto>><any>_observableThrow(response_);
       }));
   }

   protected processGetTransferOrderDetails(response: HttpResponseBase): Observable<PagedResultDtoOfTransferOrderDetailsDto> {
       const status = response.status;
       const responseBlob = 
           response instanceof HttpResponse ? response.body : 
           (<any>response).error instanceof Blob ? (<any>response).error : undefined;

       let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
       if (status === 200) {
           return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
           let result200: any = null;
           let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
           result200 = PagedResultDtoOfTransferOrderDetailsDto.fromJS(resultData200);
           return _observableOf(result200);
           }));
       } else if (status !== 200 && status !== 204) {
           return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
           return throwException("An unexpected server error occurred.", status, _responseText, _headers);
           }));
       }
       return _observableOf<PagedResultDtoOfTransferOrderDetailsDto>(<any>null);
   }

   getTransferOrderDetailById(id: number): Observable<TransferOrderDetailDto> {
      let url_ = this.baseUrl + "/api/services/app/TransferOrder/GetTransferOrderDetailInfoById?";
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
          return this.processGetTransferOrderDetailById(response_);
      })).pipe(_observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
              try {
                  return this.processGetTransferOrderDetailById(<any>response_);
              } catch (e) {
                  return <Observable<TransferOrderDetailDto>><any>_observableThrow(e);
              }
          } else
              return <Observable<TransferOrderDetailDto>><any>_observableThrow(response_);
      }));
  }

  protected processGetTransferOrderDetailById(response: HttpResponseBase): Observable<TransferOrderDetailDto> {
      const status = response.status;
      const responseBlob = 
          response instanceof HttpResponse ? response.body : 
          (<any>response).error instanceof Blob ? (<any>response).error : undefined;

      let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
      if (status === 200) {
          return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
          let result200: any = null;
          let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
          result200 = TransferOrderDetailDto.fromJS(resultData200);
          return _observableOf(result200);
          }));
      } else if (status !== 200 && status !== 204) {
          return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
          return throwException("An unexpected server error occurred.", status, _responseText, _headers);
          }));
      }
      return _observableOf<TransferOrderDetailDto>(<any>null);
  }
   
   createTransferOrder(body: GetTransferOrderMasterInput | undefined): Observable<void> {
        let url_ = this.baseUrl + "/api/services/app/TransferOrder/CreateTransferOrder";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options_ : any = {
            body: content_,
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json-patch+json", 
            })
        };

        return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processCreateTransferOrder(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processCreateTransferOrder(<any>response_);
                } catch (e) {
                    return <Observable<void>><any>_observableThrow(e);
                }
            } else
                return <Observable<void>><any>_observableThrow(response_);
        }));
    }

    protected processCreateTransferOrder(response: HttpResponseBase): Observable<void> {
        const status = response.status;
        const responseBlob = 
            response instanceof HttpResponse ? response.body : 
            (<any>response).error instanceof Blob ? (<any>response).error : undefined;
    
        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return _observableOf<void>(<any>null);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<void>(<any>null);
    }
   
    addItemForTransferOrder(body: GetTransferOrderDetailInput | undefined): Observable<void> {
         let url_ = this.baseUrl + "/api/services/app/TransferOrder/TransferOrderAddItem";
         url_ = url_.replace(/[?&]$/, "");
 
         const content_ = JSON.stringify(body);
 
         let options_ : any = {
             body: content_,
             observe: "response",
             responseType: "blob",
             headers: new HttpHeaders({
                 "Content-Type": "application/json-patch+json", 
             })
         };
 
         return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_ : any) => {
             return this.processAddItemForTransferOrder(response_);
         })).pipe(_observableCatch((response_: any) => {
             if (response_ instanceof HttpResponseBase) {
                 try {
                     return this.processAddItemForTransferOrder(<any>response_);
                 } catch (e) {
                     return <Observable<void>><any>_observableThrow(e);
                 }
             } else
                 return <Observable<void>><any>_observableThrow(response_);
         }));
     }
 
     protected processAddItemForTransferOrder(response: HttpResponseBase): Observable<void> {
         const status = response.status;
         const responseBlob = 
             response instanceof HttpResponse ? response.body : 
             (<any>response).error instanceof Blob ? (<any>response).error : undefined;
     
         let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
         if (status === 200) {
             return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
             return _observableOf<void>(<any>null);
             }));
         } else if (status !== 200 && status !== 204) {
             return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
             return throwException("An unexpected server error occurred.", status, _responseText, _headers);
             }));
         }
         return _observableOf<void>(<any>null);
     }
   
     editItemForTransferOrder(body: GetTransferOrderDetailInput | undefined): Observable<void> {
          let url_ = this.baseUrl + "/api/services/app/TransferOrder/TransferOrderEditItem";
          url_ = url_.replace(/[?&]$/, "");
  
          const content_ = JSON.stringify(body);
  
          let options_ : any = {
              body: content_,
              observe: "response",
              responseType: "blob",
              headers: new HttpHeaders({
                  "Content-Type": "application/json-patch+json", 
              })
          };
  
          return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_ : any) => {
              return this.processEditItemForTransferOrder(response_);
          })).pipe(_observableCatch((response_: any) => {
              if (response_ instanceof HttpResponseBase) {
                  try {
                      return this.processEditItemForTransferOrder(<any>response_);
                  } catch (e) {
                      return <Observable<void>><any>_observableThrow(e);
                  }
              } else
                  return <Observable<void>><any>_observableThrow(response_);
          }));
      }
  
      protected processEditItemForTransferOrder(response: HttpResponseBase): Observable<void> {
          const status = response.status;
          const responseBlob = 
              response instanceof HttpResponse ? response.body : 
              (<any>response).error instanceof Blob ? (<any>response).error : undefined;
      
          let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
          if (status === 200) {
              return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
              return _observableOf<void>(<any>null);
              }));
          } else if (status !== 200 && status !== 204) {
              return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
              return throwException("An unexpected server error occurred.", status, _responseText, _headers);
              }));
          }
          return _observableOf<void>(<any>null);
      }
   
      deleteItemForTransferOrder(body: GetTransferOrderDetailInput | undefined): Observable<void> {
           let url_ = this.baseUrl + "/api/services/app/TransferOrder/TransferOrderDeleteItem";
           url_ = url_.replace(/[?&]$/, "");
   
           const content_ = JSON.stringify(body);
   
           let options_ : any = {
               body: content_,
               observe: "response",
               responseType: "blob",
               headers: new HttpHeaders({
                   "Content-Type": "application/json-patch+json", 
               })
           };
   
           return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_ : any) => {
               return this.processDeleteItemForTransferOrder(response_);
           })).pipe(_observableCatch((response_: any) => {
               if (response_ instanceof HttpResponseBase) {
                   try {
                       return this.processDeleteItemForTransferOrder(<any>response_);
                   } catch (e) {
                       return <Observable<void>><any>_observableThrow(e);
                   }
               } else
                   return <Observable<void>><any>_observableThrow(response_);
           }));
       }
   
       protected processDeleteItemForTransferOrder(response: HttpResponseBase): Observable<void> {
           const status = response.status;
           const responseBlob = 
               response instanceof HttpResponse ? response.body : 
               (<any>response).error instanceof Blob ? (<any>response).error : undefined;
       
           let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
           if (status === 200) {
               return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
               return _observableOf<void>(<any>null);
               }));
           } else if (status !== 200 && status !== 204) {
               return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
               return throwException("An unexpected server error occurred.", status, _responseText, _headers);
               }));
           }
           return _observableOf<void>(<any>null);
       }
   
       transferItemForTransferOrder(body: GetTransferOrderMasterInput| undefined): Observable<void> {
            let url_ = this.baseUrl + "/api/services/app/TransferOrder/TransferOrderTransferItem";
            url_ = url_.replace(/[?&]$/, "");
    
            const content_ = JSON.stringify(body);
    
            let options_ : any = {
                body: content_,
                observe: "response",
                responseType: "blob",
                headers: new HttpHeaders({
                    "Content-Type": "application/json-patch+json", 
                })
            };
    
            return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_ : any) => {
                return this.processTransferItemForTransferOrder(response_);
            })).pipe(_observableCatch((response_: any) => {
                if (response_ instanceof HttpResponseBase) {
                    try {
                        return this.processTransferItemForTransferOrder(<any>response_);
                    } catch (e) {
                        return <Observable<void>><any>_observableThrow(e);
                    }
                } else
                    return <Observable<void>><any>_observableThrow(response_);
            }));
        }
    
        protected processTransferItemForTransferOrder(response: HttpResponseBase): Observable<void> {
            const status = response.status;
            const responseBlob = 
                response instanceof HttpResponse ? response.body : 
                (<any>response).error instanceof Blob ? (<any>response).error : undefined;
        
            let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
            if (status === 200) {
                return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
                return _observableOf<void>(<any>null);
                }));
            } else if (status !== 200 && status !== 204) {
                return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
                }));
            }
            return _observableOf<void>(<any>null);
        }
}

export class PagedResultDtoOfTransferOrderListDto implements IPagedResultDtoOfTransferOrderListDto {
    totalCount!: number;
    items!: TransferOrderMasterDto[] | undefined;

    constructor(data?: IPagedResultDtoOfTransferOrderListDto) {
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
                    this.items!.push(TransferOrderMasterDto.fromJS(item));
            }
        }
    }

    static fromJS(data: any): PagedResultDtoOfTransferOrderListDto {
        data = typeof data === 'object' ? data : {};
        let result = new PagedResultDtoOfTransferOrderListDto();
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

export interface IPagedResultDtoOfTransferOrderListDto {
    totalCount: number;
    items: TransferOrderMasterDto[] | undefined;
}

export class TransferOrderMasterDto implements ITransferOrderMasterDto {
    orderNo!: string | undefined;
    organizationId!: string | undefined;
    warehouseId!: string | undefined;
    consigneeId!: string | undefined;
    soStatus!: string | undefined;
    requiredDeliveryTime!: moment.Moment | undefined;
    carrierName!: string | undefined;
    lastModificationTime!: moment.Moment | undefined;
    lastModifierUserId!: number | undefined;
    creationTime!: moment.Moment;
    creatorUserId!: number | undefined;
    hedi05?: string | undefined;
    id!: number;

    constructor(data?: ITransferOrderMasterDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.orderNo = data["orderNo"];
            this.organizationId = data["organizationId"];
            this.warehouseId = data["warehouseId"];
            this.consigneeId = data["consigneeId"];
            this.soStatus = data["soStatus"];
            this.requiredDeliveryTime = data["requiredDeliveryTime"] ? moment(data["requiredDeliveryTime"].toString()) : <any>undefined;
            this.carrierName = data["carrierName"];
            this.lastModificationTime = data["lastModificationTime"] ? moment(data["lastModificationTime"].toString()) : <any>undefined;
            this.lastModifierUserId = data["lastModifierUserId"];
            this.creationTime = data["creationTime"] ? moment(data["creationTime"].toString()) : <any>undefined;
            this.creatorUserId = data["creatorUserId"];
            this.hedi05 = data["hedi05"];
            this.id = data["id"];
        }
    }

    static fromJS(data: any): TransferOrderMasterDto {
        data = typeof data === 'object' ? data : {};
        let result = new TransferOrderMasterDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["orderNo"] = this.orderNo;
        data["organizationId"] = this.organizationId;
        data["warehouseId"] = this.warehouseId;
        data["consigneeId"] = this.consigneeId;
        data["soStatus"] = this.soStatus;
        data["requiredDeliveryTime"] = this.requiredDeliveryTime ? this.requiredDeliveryTime.toISOString() : <any>undefined;
        data["carrierName"] = this.carrierName;
        data["lastModificationTime"] = this.lastModificationTime ? this.lastModificationTime.toISOString() : <any>undefined;
        data["lastModifierUserId"] = this.lastModifierUserId;
        data["creationTime"] = this.creationTime ? this.creationTime.toISOString() : <any>undefined;
        data["creatorUserId"] = this.creatorUserId;
        data["hedi05"] = this.hedi05;
        data["id"] = this.id;
        return data; 
    }
}

export interface ITransferOrderMasterDto {
    orderNo: string | undefined;
    organizationId: string | undefined;
    warehouseId: string | undefined;
    consigneeId: string | undefined;
    soStatus: string | undefined;
    requiredDeliveryTime: moment.Moment | undefined;
    carrierName: string | undefined;
    lastModificationTime: moment.Moment | undefined;
    lastModifierUserId: number | undefined;
    creationTime: moment.Moment;
    creatorUserId: number | undefined;
    hedi05?: string | undefined;
    id: number;
}

export class GetTransferOrderMasterInput implements IGetTransferOrderMasterInput {
    organizationId!: string | undefined;
    warehouseId!: string | undefined;
    consigneeId!: string | undefined;
    requiredDeliveryTime!: moment.Moment | undefined;
    carrierName!: string | undefined;
    id?: number;
    
    formatId!: number;

    constructor(data?: ITransferOrderMasterDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.organizationId = data["organizationId"];
            this.warehouseId = data["warehouseId"];
            this.consigneeId = data["consigneeId"];
            this.requiredDeliveryTime = data["requiredDeliveryTime"] ? moment(data["requiredDeliveryTime"].toString()) : <any>undefined;
            this.carrierName = data["carrierName"];
            this.id = data["id"];
        }
    }

    static fromJS(data: any): GetTransferOrderMasterInput {
        data = typeof data === 'object' ? data : {};
        let result = new GetTransferOrderMasterInput();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["organizationId"] = this.organizationId;
        data["warehouseId"] = this.warehouseId;
        data["consigneeId"] = this.consigneeId;
        data["requiredDeliveryTime"] = this.requiredDeliveryTime ? this.requiredDeliveryTime.toISOString() : <any>undefined;
        data["carrierName"] = this.carrierName;
        data["id"] = this.id;

        return data; 
    }
}

export interface IGetTransferOrderMasterInput {
    organizationId: string | undefined;
    warehouseId: string | undefined;
    consigneeId: string | undefined;
    requiredDeliveryTime: moment.Moment | undefined;
    carrierName: string | undefined;
    id?: number;
}

export class PagedResultDtoOfTransferOrderDetailsDto implements IPagedResultDtoOfTransferOrderDetailsDto {
    totalCount!: number;
    items!: TransferOrderDetailDto[] | undefined;

    constructor(data?: IPagedResultDtoOfTransferOrderDetailsDto) {
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
                    this.items!.push(TransferOrderDetailDto.fromJS(item));
            }
        }
    }

    static fromJS(data: any): PagedResultDtoOfTransferOrderDetailsDto {
        data = typeof data === 'object' ? data : {};
        let result = new PagedResultDtoOfTransferOrderDetailsDto();
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

export interface IPagedResultDtoOfTransferOrderDetailsDto {
    totalCount: number;
    items: TransferOrderDetailDto[] | undefined;
}

export class TransferOrderDetailListDto implements ITransferOrderDetailListDto {
    items!: TransferOrderDetailDto[] | undefined;

    constructor(data?: ITransferOrderDetailListDto) {
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
                    this.items!.push(TransferOrderDetailDto.fromJS(item));
            }
        }
    }

    static fromJS(data: any): TransferOrderDetailListDto {
        data = typeof data === 'object' ? data : {};
        let result = new TransferOrderDetailListDto();
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

export interface ITransferOrderDetailListDto {
    items: TransferOrderDetailDto[] | undefined;
}

export class TransferOrderDetailDto implements ITransferOrderDetailDto {
    orderLineNo!: number;
    sku!: string | undefined;
    lineStatus!: string | undefined;
    dedi09!: number;
    dedi10!: number;
    qtyOrdered!: number;
    lotNum!: string | undefined;
    expiryDate?: moment.Moment | undefined;
    lastModificationTime!: moment.Moment | undefined;
    lastModifierUserId!: number | undefined;
    creationTime!: moment.Moment;
    creatorUserId!: number | undefined;
    id!: number;

    constructor(data?: ITransferOrderDetailDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.orderLineNo = data["orderLineNo"];
            this.sku = data["sku"];
            this.lineStatus = data["lineStatus"];
            this.dedi09 = data["dedi09"];
            this.dedi10 = data["dedi10"];
            this.qtyOrdered = data["qtyOrdered"];
            this.lotNum = data["lotNum"];
            this.expiryDate = data["expiryDate"] ? moment(data["expiryDate"].toString()) : <any>undefined;
            this.lastModificationTime = data["lastModificationTime"] ? moment(data["lastModificationTime"].toString()) : <any>undefined;
            this.lastModifierUserId = data["lastModifierUserId"];
            this.creationTime = data["creationTime"] ? moment(data["creationTime"].toString()) : <any>undefined;
            this.creatorUserId = data["creatorUserId"];
            this.id = data["id"];
        }
    }

    static fromJS(data: any): TransferOrderDetailDto {
        data = typeof data === 'object' ? data : {};
        let result = new TransferOrderDetailDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["orderLineNo"] = this.orderLineNo;
        data["sku"] = this.sku;
        data["lineStatus"] = this.lineStatus;
        data["dedi09"] = this.dedi09;
        data["dedi10"] = this.dedi10;
        data["qtyOrdered"] = this.qtyOrdered;
        data["lotNum"] = this.lotNum;
        data["expiryDate"] = this.expiryDate ? this.expiryDate.toISOString() : <any>undefined;
        data["lastModificationTime"] = this.lastModificationTime ? this.lastModificationTime.toISOString() : <any>undefined;
        data["lastModifierUserId"] = this.lastModifierUserId;
        data["creationTime"] = this.creationTime ? this.creationTime.toISOString() : <any>undefined;
        data["creatorUserId"] = this.creatorUserId;
        data["id"] = this.id;
        return data; 
    }
}

export interface ITransferOrderDetailDto {
    orderLineNo: number;
    sku: string | undefined;
    lineStatus: string | undefined;
    dedi09: number;
    dedi10: number;
    qtyOrdered: number;
    lotNum: string | undefined;
    expiryDate?: moment.Moment | undefined;
    lastModificationTime: moment.Moment | undefined;
    lastModifierUserId: number | undefined;
    creationTime: moment.Moment;
    creatorUserId: number | undefined;
    id: number;
}

export class GetTransferOrderDetailInput implements IGetTransferOrderDetailInput {
    id!: number | undefined;
    orderId!: number | undefined;
    sku!: string | undefined;
    qtyOrdered!: number;
    lotNum?: string | undefined;
    expiryDate?: moment.Moment | undefined;

    constructor(data?: ITransferOrderDetailDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.id = data["id"];
            this.orderId = data["orderId"];
            this.sku = data["sku"];
            this.qtyOrdered = data["qtyOrdered"];
            this.lotNum = data["lotNum"];
            this.expiryDate = data["expiryDate"] ? moment(data["expiryDate"].toString()) : <any>undefined;
        }
    }

    static fromJS(data: any): GetTransferOrderDetailInput {
        data = typeof data === 'object' ? data : {};
        let result = new GetTransferOrderDetailInput();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["orderId"] = this.orderId;
        data["sku"] = this.sku;
        data["qtyOrdered"] = this.qtyOrdered;
        data["lotNum"] = this.lotNum;
        data["expiryDate"] = this.expiryDate ? this.expiryDate.toISOString() : <any>undefined;
        return data; 
    }
}

export interface IGetTransferOrderDetailInput {
    id: number | undefined;
    orderId: number | undefined;
    sku: string | undefined;
    qtyOrdered: number;
    lotNum?: string | undefined;
    expiryDate?: moment.Moment | undefined;
}