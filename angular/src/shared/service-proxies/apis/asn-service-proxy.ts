import { mergeMap as _observableMergeMap, catchError as _observableCatch } from 'rxjs/operators';
import { Observable, throwError as _observableThrow, of as _observableOf } from 'rxjs';
import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpResponseBase } from '@angular/common/http';

import * as moment from 'moment';

import { POMasterDto } from '@shared/service-proxies/apis/po-service-proxy';

import {
    API_BASE_URL,
    throwException,
    blobToText,
    PagedResultDtoOfNameValueDto
} from '@shared/service-proxies/service-proxies';

@Injectable()
export class ASNServiceProxy {
    private http: HttpClient;
    private baseUrl: string;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    constructor(@Inject(HttpClient) http: HttpClient, @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
        this.http = http;
        this.baseUrl = baseUrl ? baseUrl : "";
    }

    getASNMasters(
        filter: string | undefined, 
        poFilter: string | undefined, 
        asnFilter: string | undefined, 
        customerFilter: string | undefined, 
        warehouseFilter: string | undefined, 
        statusFilter: string | undefined,
        startDate: string | undefined,
        endDate: string | undefined,
        sorting: string | undefined, 
        maxResultCount: number | undefined, 
        skipCount: number | undefined
    ): Observable<PagedResultDtoOfASNListDto> {
        let url_ = this.baseUrl + "/api/services/app/ASN/GetASNListing?";
        if (filter !== undefined)
            url_ += "Filter=" + encodeURIComponent("" + filter) + "&"; 
        if (poFilter !== undefined)
            url_ += "POFilter=" + encodeURIComponent("" + poFilter) + "&"; 
        if (asnFilter !== undefined)
            url_ += "ASNFilter=" + encodeURIComponent("" + asnFilter) + "&"; 
        if (customerFilter !== undefined)
            url_ += "CustomerFilter=" + encodeURIComponent("" + customerFilter) + "&"; 
        if (warehouseFilter !== undefined)
            url_ += "WarehouseFilter=" + encodeURIComponent("" + warehouseFilter) + "&"; 
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
            return this.processGetASNMasters(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetASNMasters(<any>response_);
                } catch (e) {
                    return <Observable<PagedResultDtoOfASNListDto>><any>_observableThrow(e);
                }
            } else
                return <Observable<PagedResultDtoOfASNListDto>><any>_observableThrow(response_);
        }));
    }

    protected processGetASNMasters(response: HttpResponseBase): Observable<PagedResultDtoOfASNListDto> {
        const status = response.status;
        const responseBlob = 
            response instanceof HttpResponse ? response.body : 
            (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = PagedResultDtoOfASNListDto.fromJS(resultData200);
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<PagedResultDtoOfASNListDto>(<any>null);
    }

    getASNMasterInfoById(id: number): Observable<ASNMasterDto> {
       let url_ = this.baseUrl + "/api/services/app/ASN/GetASNInfoById?";
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
           return this.processGetASNMasterInfoById(response_);
       })).pipe(_observableCatch((response_: any) => {
           if (response_ instanceof HttpResponseBase) {
               try {
                   return this.processGetASNMasterInfoById(<any>response_);
               } catch (e) {
                   return <Observable<ASNMasterDto>><any>_observableThrow(e);
               }
           } else
               return <Observable<ASNMasterDto>><any>_observableThrow(response_);
       }));
   }

   protected processGetASNMasterInfoById(response: HttpResponseBase): Observable<ASNMasterDto> {
       const status = response.status;
       const responseBlob = 
           response instanceof HttpResponse ? response.body : 
           (<any>response).error instanceof Blob ? (<any>response).error : undefined;

       let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
       if (status === 200) {
           return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
           let result200: any = null;
           let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
           result200 = ASNMasterDto.fromJS(resultData200);
           return _observableOf(result200);
           }));
       } else if (status !== 200 && status !== 204) {
           return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
           return throwException("An unexpected server error occurred.", status, _responseText, _headers);
           }));
       }
       return _observableOf<ASNMasterDto>(<any>null);
   }

   getASNFormats(filter: string | undefined, sorting: string | undefined, maxResultCount: number | undefined, skipCount: number | undefined): Observable<PagedResultDtoOfASNFormatsDto> {
       let url_ = this.baseUrl + "/api/services/app/ASN/GetASNFormats?";
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
           return this.processGetASNFormats(response_);
       })).pipe(_observableCatch((response_: any) => {
           if (response_ instanceof HttpResponseBase) {
               try {
                   return this.processGetASNFormats(<any>response_);
               } catch (e) {
                   return <Observable<PagedResultDtoOfASNFormatsDto>><any>_observableThrow(e);
               }
           } else
               return <Observable<PagedResultDtoOfASNFormatsDto>><any>_observableThrow(response_);
       }));
   }

   protected processGetASNFormats(response: HttpResponseBase): Observable<PagedResultDtoOfASNFormatsDto> {
       const status = response.status;
       const responseBlob = 
           response instanceof HttpResponse ? response.body : 
           (<any>response).error instanceof Blob ? (<any>response).error : undefined;

       let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
       if (status === 200) {
           return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
           let result200: any = null;
           let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
           result200 = PagedResultDtoOfASNFormatsDto.fromJS(resultData200);
           return _observableOf(result200);
           }));
       } else if (status !== 200 && status !== 204) {
           return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
           return throwException("An unexpected server error occurred.", status, _responseText, _headers);
           }));
       }
       return _observableOf<PagedResultDtoOfASNFormatsDto>(<any>null);
   }

   getASNFormatById(id: number): Observable<ASNFormatDto> {
      let url_ = this.baseUrl + "/api/services/app/ASN/GetASNFormatById?";
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
          return this.processGetASNFormatById(response_);
      })).pipe(_observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
              try {
                  return this.processGetASNFormatById(<any>response_);
              } catch (e) {
                  return <Observable<ASNFormatDto>><any>_observableThrow(e);
              }
          } else
              return <Observable<ASNFormatDto>><any>_observableThrow(response_);
      }));
  }

  protected processGetASNFormatById(response: HttpResponseBase): Observable<ASNFormatDto> {
      const status = response.status;
      const responseBlob = 
          response instanceof HttpResponse ? response.body : 
          (<any>response).error instanceof Blob ? (<any>response).error : undefined;

      let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
      if (status === 200) {
          return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
          let result200: any = null;
          let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
          result200 = ASNFormatDto.fromJS(resultData200);
          return _observableOf(result200);
          }));
      } else if (status !== 200 && status !== 204) {
          return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
          return throwException("An unexpected server error occurred.", status, _responseText, _headers);
          }));
      }
      return _observableOf<ASNFormatDto>(<any>null);
  }

   getASNCases(id: number | undefined, filter: string | undefined, sorting: string | undefined, maxResultCount: number | undefined, skipCount: number | undefined): Observable<PagedResultDtoOfASNCasesDto> {
       let url_ = this.baseUrl + "/api/services/app/ASN/GetASNCasesById?";
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
           return this.processGetASNCases(response_);
       })).pipe(_observableCatch((response_: any) => {
           if (response_ instanceof HttpResponseBase) {
               try {
                   return this.processGetASNCases(<any>response_);
               } catch (e) {
                   return <Observable<PagedResultDtoOfASNCasesDto>><any>_observableThrow(e);
               }
           } else
               return <Observable<PagedResultDtoOfASNCasesDto>><any>_observableThrow(response_);
       }));
   }

   protected processGetASNCases(response: HttpResponseBase): Observable<PagedResultDtoOfASNCasesDto> {
       const status = response.status;
       const responseBlob = 
           response instanceof HttpResponse ? response.body : 
           (<any>response).error instanceof Blob ? (<any>response).error : undefined;

       let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
       if (status === 200) {
           return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
           let result200: any = null;
           let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
           result200 = PagedResultDtoOfASNCasesDto.fromJS(resultData200);
           return _observableOf(result200);
           }));
       } else if (status !== 200 && status !== 204) {
           return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
           return throwException("An unexpected server error occurred.", status, _responseText, _headers);
           }));
       }
       return _observableOf<PagedResultDtoOfASNCasesDto>(<any>null);
   }

   getASNCaseById(id: number): Observable<ASNCaseDto> {
      let url_ = this.baseUrl + "/api/services/app/ASN/GetASNCaseInfoById?";
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
          return this.processGetASNCaseById(response_);
      })).pipe(_observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
              try {
                  return this.processGetASNCaseById(<any>response_);
              } catch (e) {
                  return <Observable<ASNCaseDto>><any>_observableThrow(e);
              }
          } else
              return <Observable<ASNCaseDto>><any>_observableThrow(response_);
      }));
  }

  protected processGetASNCaseById(response: HttpResponseBase): Observable<ASNCaseDto> {
      const status = response.status;
      const responseBlob = 
          response instanceof HttpResponse ? response.body : 
          (<any>response).error instanceof Blob ? (<any>response).error : undefined;

      let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
      if (status === 200) {
          return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
          let result200: any = null;
          let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
          result200 = ASNCaseDto.fromJS(resultData200);
          return _observableOf(result200);
          }));
      } else if (status !== 200 && status !== 204) {
          return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
          return throwException("An unexpected server error occurred.", status, _responseText, _headers);
          }));
      }
      return _observableOf<ASNCaseDto>(<any>null);
  }

   getASNDetails(id: number | undefined, filter: string | undefined, sorting: string | undefined, maxResultCount: number | undefined, skipCount: number | undefined): Observable<PagedResultDtoOfASNDetailsDto> {
       let url_ = this.baseUrl + "/api/services/app/ASN/GetASNDetailsById?";
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
           return this.processGetASNDetails(response_);
       })).pipe(_observableCatch((response_: any) => {
           if (response_ instanceof HttpResponseBase) {
               try {
                   return this.processGetASNDetails(<any>response_);
               } catch (e) {
                   return <Observable<PagedResultDtoOfASNDetailsDto>><any>_observableThrow(e);
               }
           } else
               return <Observable<PagedResultDtoOfASNDetailsDto>><any>_observableThrow(response_);
       }));
   }

   protected processGetASNDetails(response: HttpResponseBase): Observable<PagedResultDtoOfASNDetailsDto> {
       const status = response.status;
       const responseBlob = 
           response instanceof HttpResponse ? response.body : 
           (<any>response).error instanceof Blob ? (<any>response).error : undefined;

       let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
       if (status === 200) {
           return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
           let result200: any = null;
           let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
           result200 = PagedResultDtoOfASNDetailsDto.fromJS(resultData200);
           return _observableOf(result200);
           }));
       } else if (status !== 200 && status !== 204) {
           return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
           return throwException("An unexpected server error occurred.", status, _responseText, _headers);
           }));
       }
       return _observableOf<PagedResultDtoOfASNDetailsDto>(<any>null);
   }

   getASNDetailByCaseId(id: number): Observable<ASNDetailDto> {
      let url_ = this.baseUrl + "/api/services/app/ASN/GetASNDetailInfoByCaseId?";
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
          return this.processGetASNDetailById(response_);
      })).pipe(_observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
              try {
                  return this.processGetASNDetailById(<any>response_);
              } catch (e) {
                  return <Observable<ASNDetailDto>><any>_observableThrow(e);
              }
          } else
              return <Observable<ASNDetailDto>><any>_observableThrow(response_);
      }));
  }

  protected processGetASNDetailById(response: HttpResponseBase): Observable<ASNDetailDto> {
      const status = response.status;
      const responseBlob = 
          response instanceof HttpResponse ? response.body : 
          (<any>response).error instanceof Blob ? (<any>response).error : undefined;

      let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
      if (status === 200) {
          return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
          let result200: any = null;
          let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
          result200 = ASNDetailDto.fromJS(resultData200);
          return _observableOf(result200);
          }));
      } else if (status !== 200 && status !== 204) {
          return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
          return throwException("An unexpected server error occurred.", status, _responseText, _headers);
          }));
      }
      return _observableOf<ASNDetailDto>(<any>null);
  }

  getASNDetailListByCaseId(id: number | undefined): Observable<ASNDetailListDto> {
      let url_ = this.baseUrl + "/api/services/app/ASN/GetASNDetailsByCaseId?";
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
          return this.processGetASNDetailListDto(response_);
      })).pipe(_observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
              try {
                  return this.processGetASNDetailListDto(<any>response_);
              } catch (e) {
                  return <Observable<ASNDetailListDto>><any>_observableThrow(e);
              }
          } else
              return <Observable<ASNDetailListDto>><any>_observableThrow(response_);
      }));
  }

  protected processGetASNDetailListDto(response: HttpResponseBase): Observable<ASNDetailListDto> {
      const status = response.status;
      const responseBlob = 
          response instanceof HttpResponse ? response.body : 
          (<any>response).error instanceof Blob ? (<any>response).error : undefined;

      let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
      if (status === 200) {
          return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
          let result200: any = null;
          let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
          result200 = ASNDetailListDto.fromJS(resultData200);
          return _observableOf(result200);
          }));
      } else if (status !== 200 && status !== 204) {
          return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
          return throwException("An unexpected server error occurred.", status, _responseText, _headers);
          }));
      }
      return _observableOf<ASNDetailListDto>(<any>null);
  }

   getPONoList(): Observable<POListDto> {
       let url_ = this.baseUrl + "/api/services/app/ASN/GetPONoList";
       //url_ = url_.replace(/[?&]$/, "");

       let options_ : any = {
           observe: "response",
           responseType: "blob",
           headers: new HttpHeaders({
               "Accept": "text/plain"
           })
       };

       return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_ : any) => {
           return this.processGetPONoList(response_);
       })).pipe(_observableCatch((response_: any) => {
           if (response_ instanceof HttpResponseBase) {
               try {
                   return this.processGetPONoList(<any>response_);
               } catch (e) {
                   return <Observable<POListDto>><any>_observableThrow(e);
               }
           } else
               return <Observable<POListDto>><any>_observableThrow(response_);
       }));
   }

   protected processGetPONoList(response: HttpResponseBase): Observable<POListDto> {
       const status = response.status;
       const responseBlob = 
           response instanceof HttpResponse ? response.body : 
           (<any>response).error instanceof Blob ? (<any>response).error : undefined;

       let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
       if (status === 200) {
           return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
           let result200: any = null;
           let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
           result200 = POListDto.fromJS(resultData200);
           return _observableOf(result200);
           }));
       } else if (status !== 200 && status !== 204) {
           return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
           return throwException("An unexpected server error occurred.", status, _responseText, _headers);
           }));
       }
       return _observableOf<POListDto>(<any>null);
   }

   getCarriers(): Observable<PagedResultDtoOfNameValueDto> {
       let url_ = this.baseUrl + "/api/services/app/ASN/GetCarriers";
       //url_ = url_.replace(/[?&]$/, "");

       let options_ : any = {
           observe: "response",
           responseType: "blob",
           headers: new HttpHeaders({
               "Accept": "text/plain"
           })
       };

       return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_ : any) => {
           return this.processGetCarriers(response_);
       })).pipe(_observableCatch((response_: any) => {
           if (response_ instanceof HttpResponseBase) {
               try {
                   return this.processGetCarriers(<any>response_);
               } catch (e) {
                   return <Observable<PagedResultDtoOfNameValueDto>><any>_observableThrow(e);
               }
           } else
               return <Observable<PagedResultDtoOfNameValueDto>><any>_observableThrow(response_);
       }));
   }

   protected processGetCarriers(response: HttpResponseBase): Observable<PagedResultDtoOfNameValueDto> {
       const status = response.status;
       const responseBlob = 
           response instanceof HttpResponse ? response.body : 
           (<any>response).error instanceof Blob ? (<any>response).error : undefined;

       let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
       if (status === 200) {
           return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
           let result200: any = null;
           let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
           result200 = PagedResultDtoOfNameValueDto.fromJS(resultData200);
           return _observableOf(result200);
           }));
       } else if (status !== 200 && status !== 204) {
           return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
           return throwException("An unexpected server error occurred.", status, _responseText, _headers);
           }));
       }
       return _observableOf<PagedResultDtoOfNameValueDto>(<any>null);
   }
   
   createASN(body: GetASNMasterInput | undefined): Observable<void> {
        let url_ = this.baseUrl + "/api/services/app/ASN/CreateASN";
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
            return this.processCreateASN(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processCreateASN(<any>response_);
                } catch (e) {
                    return <Observable<void>><any>_observableThrow(e);
                }
            } else
                return <Observable<void>><any>_observableThrow(response_);
        }));
    }

    protected processCreateASN(response: HttpResponseBase): Observable<void> {
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
   
    editASN(body: GetASNMasterInput | undefined): Observable<void> {
         let url_ = this.baseUrl + "/api/services/app/ASN/EditASN";
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
             return this.processEditASN(response_);
         })).pipe(_observableCatch((response_: any) => {
             if (response_ instanceof HttpResponseBase) {
                 try {
                     return this.processEditASN(<any>response_);
                 } catch (e) {
                     return <Observable<void>><any>_observableThrow(e);
                 }
             } else
                 return <Observable<void>><any>_observableThrow(response_);
         }));
     }
 
     protected processEditASN(response: HttpResponseBase): Observable<void> {
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
   
     deleteASN(body: GetASNMasterInput | undefined): Observable<void> {
          let url_ = this.baseUrl + "/api/services/app/ASN/confirmDelete";
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
              return this.processDeleteASN(response_);
          })).pipe(_observableCatch((response_: any) => {
              if (response_ instanceof HttpResponseBase) {
                  try {
                      return this.processDeleteASN(<any>response_);
                  } catch (e) {
                      return <Observable<void>><any>_observableThrow(e);
                  }
              } else
                  return <Observable<void>><any>_observableThrow(response_);
          }));
      }
  
      protected processDeleteASN(response: HttpResponseBase): Observable<void> {
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

      getShippingValidationById(id: number): Observable<ASNMasterDto> {
         let url_ = this.baseUrl + "/api/services/app/ASN/GetConfirmShipValidation?";
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
             return this.processGetShippingValidationById(response_);
         })).pipe(_observableCatch((response_: any) => {
             if (response_ instanceof HttpResponseBase) {
                 try {
                     return this.processGetShippingValidationById(<any>response_);
                 } catch (e) {
                     return <Observable<ASNMasterDto>><any>_observableThrow(e);
                 }
             } else
                 return <Observable<ASNMasterDto>><any>_observableThrow(response_);
         }));
     }
   
     protected processGetShippingValidationById(response: HttpResponseBase): Observable<ASNMasterDto> {
         const status = response.status;
         const responseBlob = 
             response instanceof HttpResponse ? response.body : 
             (<any>response).error instanceof Blob ? (<any>response).error : undefined;
   
         let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
         if (status === 200) {
             return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
             let result200: any = null;
             let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
             result200 = ASNMasterDto.fromJS(resultData200);
             return _observableOf(result200);
             }));
         } else if (status !== 200 && status !== 204) {
             return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
             return throwException("An unexpected server error occurred.", status, _responseText, _headers);
             }));
         }
         return _observableOf<ASNMasterDto>(<any>null);
     }
   
      shipASN(body: GetASNMasterInput | undefined): Observable<void> {
           let url_ = this.baseUrl + "/api/services/app/ASN/confirmShip";
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
               return this.processShipASN(response_);
           })).pipe(_observableCatch((response_: any) => {
               if (response_ instanceof HttpResponseBase) {
                   try {
                       return this.processShipASN(<any>response_);
                   } catch (e) {
                       return <Observable<void>><any>_observableThrow(e);
                   }
               } else
                   return <Observable<void>><any>_observableThrow(response_);
           }));
       }
   
       protected processShipASN(response: HttpResponseBase): Observable<void> {
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
   
    addASNFormat(body: GetASNFormatInput | undefined): Observable<void> {
         let url_ = this.baseUrl + "/api/services/app/ASN/AddASNFormat";
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
             return this.processAddASNFormat(response_);
         })).pipe(_observableCatch((response_: any) => {
             if (response_ instanceof HttpResponseBase) {
                 try {
                     return this.processAddASNFormat(<any>response_);
                 } catch (e) {
                     return <Observable<void>><any>_observableThrow(e);
                 }
             } else
                 return <Observable<void>><any>_observableThrow(response_);
         }));
     }
 
     protected processAddASNFormat(response: HttpResponseBase): Observable<void> {
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
   
     editASNFormat(body: GetASNFormatInput | undefined): Observable<void> {
          let url_ = this.baseUrl + "/api/services/app/ASN/EditASNFormat";
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
              return this.processEditASNFormat(response_);
          })).pipe(_observableCatch((response_: any) => {
              if (response_ instanceof HttpResponseBase) {
                  try {
                      return this.processEditASNFormat(<any>response_);
                  } catch (e) {
                      return <Observable<void>><any>_observableThrow(e);
                  }
              } else
                  return <Observable<void>><any>_observableThrow(response_);
          }));
      }
  
      protected processEditASNFormat(response: HttpResponseBase): Observable<void> {
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

     addCase(body: GetASNCaseInput | undefined): Observable<number> {
         let url_ = this.baseUrl + "/api/services/app/ASN/GetIdFromAddCase?";
         if (body.id === null)
             throw new Error("The parameter 'Id' cannot be null.");
         else if (body.id !== undefined)
             url_ += "id=" + encodeURIComponent("" + body.id) + "&"; 
         if (body.ctnType === null)
             throw new Error("The parameter 'Case Type' cannot be null.");
         else if (body.ctnType !== undefined)
             url_ += "ctnType=" + encodeURIComponent("" + body.ctnType) + "&"; 
         if (body.ctnSize === null)
             throw new Error("The parameter 'Case Volume' cannot be null.");
         else if (body.ctnSize !== undefined)
             url_ += "ctnSize=" + encodeURIComponent("" + body.ctnSize) + "&"; 
         if (body.ctnGrossWeight === null)
             throw new Error("The parameter 'Case Weight' cannot be null.");
         else if (body.ctnGrossWeight !== undefined)
             url_ += "ctnGrossWeight=" + encodeURIComponent("" + body.ctnGrossWeight) + "&"; 
        if (body.ctnSealNo1 !== undefined)
             url_ += "ctnSealNo1=" + encodeURIComponent("" + body.ctnSealNo1) + "&"; 
         url_ = url_.replace(/[?&]$/, "");
 
         let options_ : any = {
             observe: "response",
             responseType: "blob",
             headers: new HttpHeaders({
                 "Accept": "text/plain"
             })
         };
  
         return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_ : any) => {
             return this.processAddCase(response_);
         })).pipe(_observableCatch((response_: any) => {
             if (response_ instanceof HttpResponseBase) {
                 try {
                     return this.processAddCase(<any>response_);
                 } catch (e) {
                     return <Observable<number>><any>_observableThrow(e);
                 }
             } else
                 return <Observable<number>><any>_observableThrow(response_);
         }));
     }
  
     protected processAddCase(response: HttpResponseBase): Observable<number> {
         const status = response.status;
         const responseBlob = 
             response instanceof HttpResponse ? response.body : 
             (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = resultData200 !== undefined ? resultData200 : <any>null;
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<number>(<any>null);
     }
   
     addLineItemForCase(body: GetASNDetailInput | undefined): Observable<void> {
          let url_ = this.baseUrl + "/api/services/app/ASN/AddLineItemForCase";
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
              return this.processAddLineItemForCase(response_);
          })).pipe(_observableCatch((response_: any) => {
              if (response_ instanceof HttpResponseBase) {
                  try {
                      return this.processAddLineItemForCase(<any>response_);
                  } catch (e) {
                      return <Observable<void>><any>_observableThrow(e);
                  }
              } else
                  return <Observable<void>><any>_observableThrow(response_);
          }));
      }
  
      protected processAddLineItemForCase(response: HttpResponseBase): Observable<void> {
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
   
     editCase(body: GetASNCaseInput | undefined): Observable<void> {
          let url_ = this.baseUrl + "/api/services/app/ASN/EditCase";
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
              return this.processEditCase(response_);
          })).pipe(_observableCatch((response_: any) => {
              if (response_ instanceof HttpResponseBase) {
                  try {
                      return this.processEditCase(<any>response_);
                  } catch (e) {
                      return <Observable<void>><any>_observableThrow(e);
                  }
              } else
                  return <Observable<void>><any>_observableThrow(response_);
          }));
      }
  
      protected processEditCase(response: HttpResponseBase): Observable<void> {
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
   
     addLineItem(body: GetASNDetailInput | undefined): Observable<void> {
          let url_ = this.baseUrl + "/api/services/app/ASN/AddLineItem";
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
              return this.processAddLineItem(response_);
          })).pipe(_observableCatch((response_: any) => {
              if (response_ instanceof HttpResponseBase) {
                  try {
                      return this.processAddLineItem(<any>response_);
                  } catch (e) {
                      return <Observable<void>><any>_observableThrow(e);
                  }
              } else
                  return <Observable<void>><any>_observableThrow(response_);
          }));
      }
  
      protected processAddLineItem(response: HttpResponseBase): Observable<void> {
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
   
      editLineItem(body: GetASNDetailInput | undefined): Observable<void> {
           let url_ = this.baseUrl + "/api/services/app/ASN/EditLineItem";
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
               return this.processEditLineItem(response_);
           })).pipe(_observableCatch((response_: any) => {
               if (response_ instanceof HttpResponseBase) {
                   try {
                       return this.processEditLineItem(<any>response_);
                   } catch (e) {
                       return <Observable<void>><any>_observableThrow(e);
                   }
               } else
                   return <Observable<void>><any>_observableThrow(response_);
           }));
       }
   
       protected processEditLineItem(response: HttpResponseBase): Observable<void> {
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
   
       deleteCase(body: GetASNCaseInput | undefined): Observable<void> {
            let url_ = this.baseUrl + "/api/services/app/ASN/confirmDeleteCase";
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
                return this.processDeleteCase(response_);
            })).pipe(_observableCatch((response_: any) => {
                if (response_ instanceof HttpResponseBase) {
                    try {
                        return this.processDeleteCase(<any>response_);
                    } catch (e) {
                        return <Observable<void>><any>_observableThrow(e);
                    }
                } else
                    return <Observable<void>><any>_observableThrow(response_);
            }));
        }
    
        protected processDeleteCase(response: HttpResponseBase): Observable<void> {
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

export class PagedResultDtoOfASNListDto implements IPagedResultDtoOfASNListDto {
    totalCount!: number;
    items!: ASNMasterDto[] | undefined;

    constructor(data?: IPagedResultDtoOfASNListDto) {
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
                    this.items!.push(ASNMasterDto.fromJS(item));
            }
        }
    }

    static fromJS(data: any): PagedResultDtoOfASNListDto {
        data = typeof data === 'object' ? data : {};
        let result = new PagedResultDtoOfASNListDto();
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

export interface IPagedResultDtoOfASNListDto {
    totalCount: number;
    items: ASNMasterDto[] | undefined;
}

export class ASNMasterDto implements IASNMasterDto {
    asnNo!: string | undefined;
    poNo!: string | undefined;
    organizationId!: string | undefined;
    customerId!: string | undefined;
    warehouseId!: string | undefined;
    supplierId!: string | undefined;
    asnStatus!: string | undefined;
    expectedArriveTime1!: moment.Moment | undefined;
    carrierName!: string | undefined;
    lastModificationTime!: moment.Moment | undefined;
    lastModifierUserId!: number | undefined;
    creationTime!: moment.Moment;
    creatorUserId!: number | undefined;
    udf01!: string | undefined;
    id!: number;

    constructor(data?: IASNMasterDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.asnNo = data["asnNo"];
            this.poNo = data["poNo"];
            this.organizationId = data["organizationId"];
            this.customerId = data["customerId"];
            this.warehouseId = data["warehouseId"];
            this.supplierId = data["supplierId"];
            this.asnStatus = data["asnStatus"];
            this.expectedArriveTime1 = data["expectedArriveTime1"] ? moment(data["expectedArriveTime1"].toString()) : <any>undefined;
            this.carrierName = data["carrierName"];
            this.lastModificationTime = data["lastModificationTime"] ? moment(data["lastModificationTime"].toString()) : <any>undefined;
            this.lastModifierUserId = data["lastModifierUserId"];
            this.creationTime = data["creationTime"] ? moment(data["creationTime"].toString()) : <any>undefined;
            this.creatorUserId = data["creatorUserId"];
            this.udf01 = data["udf01"];
            this.id = data["id"];
        }
    }

    static fromJS(data: any): ASNMasterDto {
        data = typeof data === 'object' ? data : {};
        let result = new ASNMasterDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["asnNo"] = this.asnNo;
        data["poNo"] = this.poNo;
        data["organizationId"] = this.organizationId;
        data["customerId"] = this.customerId;
        data["warehouseId"] = this.warehouseId;
        data["supplierId"] = this.supplierId;
        data["asnStatus"] = this.asnStatus;
        data["expectedArriveTime1"] = this.expectedArriveTime1 ? this.expectedArriveTime1.toISOString() : <any>undefined;
        data["carrierName"] = this.carrierName;
        data["lastModificationTime"] = this.lastModificationTime ? this.lastModificationTime.toISOString() : <any>undefined;
        data["lastModifierUserId"] = this.lastModifierUserId;
        data["creationTime"] = this.creationTime ? this.creationTime.toISOString() : <any>undefined;
        data["creatorUserId"] = this.creatorUserId;
        data["udf01"] = this.udf01;
        data["id"] = this.id;
        return data; 
    }
}

export interface IASNMasterDto {
    asnNo: string | undefined;
    poNo: string | undefined;
    organizationId: string | undefined;
    customerId: string | undefined;
    warehouseId: string | undefined;
    supplierId: string | undefined;
    asnStatus: string | undefined;
    expectedArriveTime1: moment.Moment | undefined;
    carrierName: string | undefined;
    lastModificationTime: moment.Moment | undefined;
    lastModifierUserId: number | undefined;
    creationTime: moment.Moment;
    creatorUserId: number | undefined;
    udf01: string | undefined;
    id: number;
}

export class GetASNMasterInput implements IGetASNMasterInput {
    asnNo!: string | undefined;
    poNo!: string | undefined;
    expectedArriveTime1!: moment.Moment | undefined;
    carrierName!: string | undefined;
    id?: number;
    
    formatId!: number;

    constructor(data?: IASNMasterDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.asnNo = data["asnNo"];
            this.poNo = data["poNo"];
            this.expectedArriveTime1 = data["expectedArriveTime1"] ? moment(data["expectedArriveTime1"].toString()) : <any>undefined;
            this.carrierName = data["carrierName"];
            this.id = data["id"];

            this.formatId = data["formatId"];
        }
    }

    static fromJS(data: any): GetASNMasterInput {
        data = typeof data === 'object' ? data : {};
        let result = new GetASNMasterInput();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["asnNo"] = this.asnNo;
        data["poNo"] = this.poNo;
        data["expectedArriveTime1"] = this.expectedArriveTime1 ? this.expectedArriveTime1.toISOString() : <any>undefined;
        data["carrierName"] = this.carrierName;
        data["id"] = this.id;
        
        data["formatId"] = this.formatId;

        return data; 
    }
}

export interface IGetASNMasterInput {
    asnNo: string | undefined;
    poNo: string | undefined;
    expectedArriveTime1: moment.Moment | undefined;
    carrierName: string | undefined;
    id?: number;
    
    formatId: number;
}

export class PagedResultDtoOfASNFormatsDto implements IPagedResultDtoOfASNFormatsDto {
    totalCount!: number;
    items!: ASNFormatDto[] | undefined;

    constructor(data?: IPagedResultDtoOfASNFormatsDto) {
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
                    this.items!.push(ASNFormatDto.fromJS(item));
            }
        }
    }

    static fromJS(data: any): PagedResultDtoOfASNFormatsDto {
        data = typeof data === 'object' ? data : {};
        let result = new PagedResultDtoOfASNFormatsDto();
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

export interface IPagedResultDtoOfASNFormatsDto {
    totalCount: number;
    items: ASNFormatDto[] | undefined;
}

export class ASNFormatDto implements IASNFormatDto {
    prefix!: string | undefined;
    hasDate!: number;
    isStatic!: number;
    lastModificationTime!: moment.Moment | undefined;
    lastModifierUserId!: number | undefined;
    creationTime!: moment.Moment;
    creatorUserId!: number | undefined;
    id!: number;

    constructor(data?: IASNFormatDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.prefix = data["prefix"];
            this.hasDate = data["hasDate"];
            this.isStatic = data["isStatic"];
            this.lastModificationTime = data["lastModificationTime"] ? moment(data["lastModificationTime"].toString()) : <any>undefined;
            this.lastModifierUserId = data["lastModifierUserId"];
            this.creationTime = data["creationTime"] ? moment(data["creationTime"].toString()) : <any>undefined;
            this.creatorUserId = data["creatorUserId"];
            this.id = data["id"];
        }
    }

    static fromJS(data: any): ASNFormatDto {
        data = typeof data === 'object' ? data : {};
        let result = new ASNFormatDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["prefix"] = this.prefix;
        data["hasDate"] = this.hasDate;
        data["isStatic"] = this.isStatic;
        data["lastModificationTime"] = this.lastModificationTime ? this.lastModificationTime.toISOString() : <any>undefined;
        data["lastModifierUserId"] = this.lastModifierUserId;
        data["creationTime"] = this.creationTime ? this.creationTime.toISOString() : <any>undefined;
        data["creatorUserId"] = this.creatorUserId;
        data["id"] = this.id;
        return data; 
    }
}

export interface IASNFormatDto {
    prefix: string | undefined;
    hasDate: number;
    isStatic: number;
    lastModificationTime: moment.Moment | undefined;
    lastModifierUserId: number | undefined;
    creationTime: moment.Moment;
    creatorUserId: number | undefined;
    id: number;
}

export class GetASNFormatInput implements IGetASNFormatInput {
    prefix!: string | undefined;
    hasDate!: number;
    id?: number;

    constructor(data?: IASNFormatDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.prefix = data["prefix"];
            this.hasDate = data["hasDate"];
            this.id = data["id"];
        }
    }

    static fromJS(data: any): GetASNFormatInput {
        data = typeof data === 'object' ? data : {};
        let result = new GetASNFormatInput();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["prefix"] = this.prefix;
        data["hasDate"] = this.hasDate;
        data["id"] = this.id;
        return data; 
    }
}

export interface IGetASNFormatInput {
    prefix: string | undefined;
    hasDate: number;
    id?: number;
}

export class PagedResultDtoOfASNCasesDto implements IPagedResultDtoOfASNCasesDto {
    totalCount!: number;
    items!: ASNCaseDto[] | undefined;

    constructor(data?: IPagedResultDtoOfASNCasesDto) {
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
                    this.items!.push(ASNCaseDto.fromJS(item));
            }
        }
    }

    static fromJS(data: any): PagedResultDtoOfASNCasesDto {
        data = typeof data === 'object' ? data : {};
        let result = new PagedResultDtoOfASNCasesDto();
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

export interface IPagedResultDtoOfASNCasesDto {
    totalCount: number;
    items: ASNCaseDto[] | undefined;
}

export class ASNCaseDto implements IASNCaseDto {
    asnNo!: string | undefined;
    ctnNo!: string | undefined;
    ctnLineNo!: number | undefined;
    ctnType!: string | undefined;
    totalLineNo!: number | undefined;
    ctnSize!: string | undefined;
    ctnGrossWeight!: number | undefined;
    ctnSealNo1!: string | undefined;
    lastModificationTime!: moment.Moment | undefined;
    lastModifierUserId!: number | undefined;
    creationTime!: moment.Moment;
    creatorUserId!: number | undefined;
    id!: number;

    constructor(data?: IASNCaseDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.asnNo = data["asnNo"];
            this.ctnNo = data["ctnNo"];
            this.ctnLineNo = data["ctnLineNo"];
            this.ctnType = data["ctnType"];
            this.totalLineNo = data["totalLineNo"];
            this.ctnSize = data["ctnSize"];
            this.ctnGrossWeight = data["ctnGrossWeight"];
            this.ctnSealNo1 = data["ctnSealNo1"];
            this.lastModificationTime = data["lastModificationTime"] ? moment(data["lastModificationTime"].toString()) : <any>undefined;
            this.lastModifierUserId = data["lastModifierUserId"];
            this.creationTime = data["creationTime"] ? moment(data["creationTime"].toString()) : <any>undefined;
            this.creatorUserId = data["creatorUserId"];
            this.id = data["id"];
        }
    }

    static fromJS(data: any): ASNCaseDto {
        data = typeof data === 'object' ? data : {};
        let result = new ASNCaseDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["asnNo"] = this.asnNo;
        data["ctnNo"] = this.ctnNo;
        data["ctnLineNo"] = this.ctnLineNo;
        data["ctnType"] = this.ctnType;
        data["totalLineNo"] = this.totalLineNo;
        data["ctnSize"] = this.ctnSize;
        data["ctnGrossWeight"] = this.ctnGrossWeight;
        data["ctnSealNo1"] = this.ctnSealNo1;
        data["lastModificationTime"] = this.lastModificationTime ? this.lastModificationTime.toISOString() : <any>undefined;
        data["lastModifierUserId"] = this.lastModifierUserId;
        data["creationTime"] = this.creationTime ? this.creationTime.toISOString() : <any>undefined;
        data["creatorUserId"] = this.creatorUserId;
        data["id"] = this.id;
        return data; 
    }
}

export interface IASNCaseDto {
    asnNo: string | undefined;
    ctnNo: string | undefined;
    ctnLineNo: number | undefined;
    ctnType: string | undefined;
    totalLineNo: number | undefined;
    ctnSize: string | undefined;
    ctnGrossWeight: number | undefined;
    ctnSealNo1: string | undefined;
    lastModificationTime: moment.Moment | undefined;
    lastModifierUserId: number | undefined;
    creationTime: moment.Moment;
    creatorUserId: number | undefined;
    id: number;
}

export class GetASNCaseInput implements IGetASNCaseInput {
    id!: number | undefined;
    ctnNo!: string | undefined
    ctnType!: string | undefined
    ctnSize!: string | undefined;
    ctnGrossWeight!: number | undefined;
    ctnSealNo1?: string | undefined;

    constructor(data?: IASNCaseDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            data["id"] = this.id;
            data["ctnNo"] = this.ctnNo;
            data["ctnType"] = this.ctnType;
            data["ctnSize"] = this.ctnSize;
            data["ctnGrossWeight"] = this.ctnGrossWeight;
            data["ctnSealNo1"] = this.ctnSealNo1;
        }
    }

    static fromJS(data: any): GetASNCaseInput {
        data = typeof data === 'object' ? data : {};
        let result = new GetASNCaseInput();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["ctnNo"] = this.ctnNo;
        data["ctnType"] = this.ctnType;
        data["ctnSize"] = this.ctnSize;
        data["ctnGrossWeight"] = this.ctnGrossWeight;
        data["ctnSealNo1"] = this.ctnSealNo1;
        return data; 
    }
}

export interface IGetASNCaseInput {
    id: number | undefined;
    ctnNo: string | undefined
    ctnType: string | undefined
    ctnSize: string | undefined;
    ctnGrossWeight: number | undefined;
    ctnSealNo1?: string | undefined;
}

export class PagedResultDtoOfASNDetailsDto implements IPagedResultDtoOfASNDetailsDto {
    totalCount!: number;
    items!: ASNDetailDto[] | undefined;

    constructor(data?: IPagedResultDtoOfASNDetailsDto) {
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
                    this.items!.push(ASNDetailDto.fromJS(item));
            }
        }
    }

    static fromJS(data: any): PagedResultDtoOfASNDetailsDto {
        data = typeof data === 'object' ? data : {};
        let result = new PagedResultDtoOfASNDetailsDto();
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

export interface IPagedResultDtoOfASNDetailsDto {
    totalCount: number;
    items: ASNDetailDto[] | undefined;
}

export class ASNDetailListDto implements IASNDetailListDto {
    items!: ASNDetailDto[] | undefined;

    constructor(data?: IASNDetailListDto) {
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
                    this.items!.push(ASNDetailDto.fromJS(item));
            }
        }
    }

    static fromJS(data: any): ASNDetailListDto {
        data = typeof data === 'object' ? data : {};
        let result = new ASNDetailListDto();
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

export interface IASNDetailListDto {
    items: ASNDetailDto[] | undefined;
}

export class ASNDetailDto implements IASNDetailDto {
    asnLineNo!: number;
    sku!: string | undefined;
    skuDescr!: string | undefined;
    expectedQty!: number;
    receivedQty!: number;
    openedQty!: number;
    shippedQty!: number;
    containerId!: string | undefined;
    containerQty!: number | undefined;
    lotAtt01!: string | undefined;
    expiryDate?: moment.Moment | undefined;
    lastModificationTime!: moment.Moment | undefined;
    lastModifierUserId!: number | undefined;
    creationTime!: moment.Moment;
    creatorUserId!: number | undefined;
    id!: number;

    constructor(data?: IASNDetailDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.asnLineNo = data["asnLineNo"];
            this.sku = data["sku"];
            this.skuDescr = data["skuDescr"];
            this.expectedQty = data["expectedQty"];
            this.receivedQty = data["receivedQty"];
            this.openedQty = data["openedQty"];
            this.shippedQty = data["shippedQty"];
            this.containerId = data["containerId"];
            this.containerQty = data["containerQty"];
            this.lotAtt01 = data["lotAtt01"];
            this.expiryDate = data["expiryDate"] ? moment(data["expiryDate"].toString()) : <any>undefined;
            this.lastModificationTime = data["lastModificationTime"] ? moment(data["lastModificationTime"].toString()) : <any>undefined;
            this.lastModifierUserId = data["lastModifierUserId"];
            this.creationTime = data["creationTime"] ? moment(data["creationTime"].toString()) : <any>undefined;
            this.creatorUserId = data["creatorUserId"];
            this.id = data["id"];
        }
    }

    static fromJS(data: any): ASNDetailDto {
        data = typeof data === 'object' ? data : {};
        let result = new ASNDetailDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["asnLineNo"] = this.asnLineNo;
        data["sku"] = this.sku;
        data["skuDescr"] = this.skuDescr;
        data["expectedQty"] = this.expectedQty;
        data["receivedQty"] = this.receivedQty;
        data["openedQty"] = this.openedQty;
        data["shippedQty"] = this.shippedQty;
        data["containerId"] = this.containerId;
        data["containerQty"] = this.containerQty;
        data["lotAtt01"] = this.lotAtt01;
        data["expiryDate"] = this.expiryDate ? this.expiryDate.toISOString() : <any>undefined;
        data["lastModificationTime"] = this.lastModificationTime ? this.lastModificationTime.toISOString() : <any>undefined;
        data["lastModifierUserId"] = this.lastModifierUserId;
        data["creationTime"] = this.creationTime ? this.creationTime.toISOString() : <any>undefined;
        data["creatorUserId"] = this.creatorUserId;
        data["id"] = this.id;
        return data; 
    }
}

export interface IASNDetailDto {
    asnLineNo: number;
    sku: string | undefined;
    skuDescr: string | undefined;
    expectedQty: number;
    receivedQty: number;
    openedQty: number;
    shippedQty: number;
    containerId: string | undefined;
    containerQty: number;
    lotAtt01: string | undefined;
    expiryDate?: moment.Moment | undefined;
    lastModificationTime: moment.Moment | undefined;
    lastModifierUserId: number | undefined;
    creationTime: moment.Moment;
    creatorUserId: number | undefined;
    id: number;
}

export class GetASNDetailInput implements IGetASNDetailInput {
    id!: number | undefined;
    asnNo!: string | undefined;
    ctnId!: number | undefined;
    sku!: string | undefined;
    skuDescr!: string | undefined;
    orderedQty!: number | undefined;
    expectedQty!: number | undefined;
    openedQty!: number;
    shippedQty!: number;
    containerId!: string | undefined;
    containerQty!: number | undefined;
    lotAtt01?: string | undefined;
    expiryDate?: moment.Moment | undefined;

    constructor(data?: IASNDetailDto) {
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
            this.asnNo = data["asnNo"];
            this.ctnId = data["ctnId"];
            this.sku = data["sku"];
            this.skuDescr = data["skuDescr"];
            this.orderedQty = data["orderedQty"];
            this.expectedQty = data["expectedQty"];
            this.openedQty = data["openedQty"];
            this.shippedQty = data["shippedQty"];
            this.containerId = data["containerId"];
            this.containerQty = data["containerQty"];
            this.lotAtt01 = data["lotAtt01"];
            this.expiryDate = data["expiryDate"] ? moment(data["expiryDate"].toString()) : <any>undefined;
        }
    }

    static fromJS(data: any): GetASNDetailInput {
        data = typeof data === 'object' ? data : {};
        let result = new GetASNDetailInput();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["asnNo"] = this.asnNo;
        data["ctnId"] = this.ctnId;
        data["sku"] = this.sku;
        data["skuDescr"] = this.skuDescr;
        data["orderedQty"] = this.orderedQty;
        data["expectedQty"] = this.expectedQty;
        data["openedQty"] = this.openedQty;
        data["shippedQty"] = this.shippedQty;
        data["containerId"] = this.containerId;
        data["containerQty"] = this.containerQty;
        data["lotAtt01"] = this.lotAtt01;
        data["expiryDate"] = this.expiryDate ? this.expiryDate.toISOString() : <any>undefined;
        return data; 
    }
}

export interface IGetASNDetailInput {
    id: number | undefined;
    asnNo: string | undefined;
    ctnId: number | undefined;
    sku: string | undefined
    skuDescr: string | undefined;
    orderedQty: number | undefined;
    expectedQty: number | undefined;
    openedQty: number;
    shippedQty: number;
    containerId: string | undefined;
    containerQty: number | undefined;
    lotAtt01?: string | undefined;
    expiryDate?: moment.Moment | undefined;
}

export class POListDto implements IPOListDto {
    items!: POMasterDto[] | undefined;

    constructor(data?: IPOListDto) {
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
                    this.items!.push(POMasterDto.fromJS(item));
            }
        }
    }

    static fromJS(data: any): POListDto {
        data = typeof data === 'object' ? data : {};
        let result = new POListDto();
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

export interface IPOListDto {
    items: POMasterDto[] | undefined;
}