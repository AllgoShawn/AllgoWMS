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
import { Header } from 'primeng/components/common/shared';
import { stringify } from 'querystring';
import { property } from 'lodash';
import { url } from 'inspector';

@Injectable()
export class WarehouseServiceProxy {
    private http: HttpClient;
    private baseUrl: string;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    constructor(@Inject(HttpClient) http: HttpClient, @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
        this.http = http;
        this.baseUrl = baseUrl ? baseUrl : "";
    }

    getWarehouses(id: number | undefined, filter: string | undefined, sorting: string | undefined, maxResultCount: number | undefined, skipCount: number | undefined): Observable<PagedResultDtoOfWarehouseListDto> {
        let url_ = this.baseUrl + "/api/services/app/Warehouse/GetWarehouses?";
        if (id === null)
            throw new Error("The parameter 'id' cannot be null.");
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
            return this.processGetWarehouses(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetWarehouses(<any>response_);
                } catch (e) {
                    return <Observable<PagedResultDtoOfWarehouseListDto>><any>_observableThrow(e);
                }
            } else
                return <Observable<PagedResultDtoOfWarehouseListDto>><any>_observableThrow(response_);
        }));
    }

    protected processGetWarehouses(response: HttpResponseBase): Observable<PagedResultDtoOfWarehouseListDto> {
        const status = response.status;
        const responseBlob = 
            response instanceof HttpResponse ? response.body : 
            (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = PagedResultDtoOfWarehouseListDto.fromJS(resultData200);
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<PagedResultDtoOfWarehouseListDto>(<any>null);
    }

    createWarehouse(body: CreateWarehouseInput | undefined): Observable<void> {
        let url_ = this.baseUrl + "/api/services/app/Warehouse/CreateWarehouse";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options_ : any = {
            body: content_,
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json-patch+json", 
                "Accept": "text/plain"
            })
        };

        return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processCreateWarehouse(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processCreateWarehouse(<any>response_);
                } catch (e) {
                    return <Observable<void>><any>_observableThrow(e);
                }
            } else
                return <Observable<void>><any>_observableThrow(response_);
        }));
    }

    protected processCreateWarehouse(response: HttpResponseBase): Observable<void> {
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

    updateWarehouse(body: UpdateWarehouseInput | undefined): Observable<void>{
        let url_ = this.baseUrl + "/api/services/app/Warehouse/UpdateWarehouse";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options_ : any = {
            body: content_,
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json-patch+json", 
                "Accept": "text/plain"
            })
        };

        return this.http.request("put", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processUpdateWarehouse(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processUpdateWarehouse(<any>response_);
                } catch (e) {
                    return <Observable<void>><any>_observableThrow(e);
                }
            } else
                return <Observable<void>><any>_observableThrow(response_);
        }));
    }

    protected processUpdateWarehouse(response: HttpResponseBase): Observable<void> {
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

    deleteWarehouse(body: UpdateWarehouseInput | undefined): Observable<void>{
        let url_ = this.baseUrl + "/api/services/app/Warehouse/UpdateToDeleteWarehouse";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options_ : any = {
            body: content_,
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json-patch+json", 
                "Accept": "text/plain"
            })
        };

        return this.http.request("put", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processUpdateWarehouse(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processUpdateWarehouse(<any>response_);
                } catch (e) {
                    return <Observable<void>><any>_observableThrow(e);
                }
            } else
                return <Observable<void>><any>_observableThrow(response_);
        }));
    }

    protected processDeleteWarehouse(response: HttpResponseBase): Observable<void> {
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

    createWarehouseMaster(body: GetWarehouseMasterInput | undefined): Observable<void> {
        let url_ = this.baseUrl + "/api/services/app/Warehouse/CreateWarehouseMaster";
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
        
        return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_ :any) => {
            return this.processCreateWarehouseMaster(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processCreateWarehouseMaster(<any>response_);
                } catch (e) {
                    return <Observable<void>><any>_observableThrow(e);
                }
            } else
                return <Observable<void>><any>_observableThrow(response_);
        }));
    }

    protected processCreateWarehouseMaster(response: HttpResponseBase): Observable<void> {
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

    getWarehouseMasters(
        filter: string | undefined,
        whseCodeFilter: string | undefined,
        whseNameFilter: string |undefined,
        whseStatusFilter: string | undefined,
        sorting: string |undefined,
        maxResultCount: number | undefined,
        skipCount: number | undefined
    ): Observable<PagedResultDtoOfWarehouseMasterDto> {
        let url_ = this.baseUrl + "/api/services/app/Warehouse/GetWarehouseMasterListing?";
        if (filter !== undefined)
            url_ += "Filter=" + encodeURIComponent("" + filter) + "&";
        if (whseCodeFilter !== undefined)
            url_ += "whseCodeFilter=" + encodeURIComponent("" + whseCodeFilter) + "&";
        if (whseNameFilter !== undefined)
            url_ += "whseNameFilter=" + encodeURIComponent("" + whseNameFilter) + "&";
        if (whseStatusFilter !== undefined)
            url_ += "whseStatusFilter=" + encodeURIComponent("" + whseStatusFilter) + "&";
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
            return this.processGetWarehouseMaster(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetWarehouseMaster(<any>response_);
                } catch (e) {
                    return <Observable<PagedResultDtoOfWarehouseMasterDto>><any>_observableThrow(e);
                }
            } else
                return <Observable<PagedResultDtoOfWarehouseMasterDto>><any>_observableThrow(response_);
        }));
    }

    protected processGetWarehouseMaster(response: HttpResponseBase): Observable<PagedResultDtoOfWarehouseMasterDto> {
        const status = response.status;
        const responseBlob = 
            response instanceof HttpResponse ? response.body : 
            (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = PagedResultDtoOfWarehouseMasterDto.fromJS(resultData200);
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<PagedResultDtoOfWarehouseMasterDto>(<any>null);
    }

    getWarehouseMastersById(id: number): Observable<WarehouseMasterDto> {
        let url_ = this.baseUrl + "/api/services/app/Warehouse/GetWarehouseMasterById?";
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
            return this.processGetWarehouseMasterInfoById(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetWarehouseMasterInfoById(<any>response_);
                } catch (e) {
                    return <Observable<WarehouseMasterDto>><any>_observableThrow(e);
                }
            } else
                return <Observable<WarehouseMasterDto>><any>_observableThrow(response_);
        })); 
    }

    protected processGetWarehouseMasterInfoById(response: HttpResponseBase): Observable<WarehouseMasterDto> {
        const status = response.status;
        const responseBlob = 
            response instanceof HttpResponse ? response.body : 
            (<any>response).error instanceof Blob ? (<any>response).error : undefined;
 
        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = WarehouseMasterDto.fromJS(resultData200);
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<WarehouseMasterDto>(<any>null);
    }

    editWarehouseMaster(body: GetWarehouseMasterInput | undefined): Observable<void> {
        let url_ = this.baseUrl + "/api/services/app/Warehouse/EditWarehouseMaster";
        url_ = url_.replace(/[?&]$/,"");

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
            return this.processEditWarehouseMaster(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processEditWarehouseMaster(<any>response_);
                } catch (e) {
                    return <Observable<void>><any>_observableThrow(e);
                }
            } else
                return <Observable<void>><any>_observableThrow(response_);
        }));
    }

    protected processEditWarehouseMaster(response: HttpResponseBase): Observable<void> {
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

    deleteWarehouseMaster(body: GetWarehouseMasterInput | undefined): Observable<void> {
        let url_ = this.baseUrl + "/api/services/app/Warehouse/confirmDelete";
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
            return this.processDeleteWarehouse(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processDeleteWarehouse(<any>response_);
                } catch (e) {
                    return <Observable<void>><any>_observableThrow(e);
                }
            } else
                return <Observable<void>><any>_observableThrow(response_);
        }));
    }
}

export class WarehouseListDto implements IWarehouseListDto {
    code!: string | undefined;
    updatedTime!: moment.Moment;
    memberCount!: number;
    workZoneCount!: number;
    id!: number;

    constructor(data?: IWarehouseListDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.code = data["code"];
            this.updatedTime = data["updatedTime"] ? moment(data["updatedTime"].toString()) : <any>undefined;
            this.memberCount = data["memberCount"];
            this.workZoneCount = data["workZoneCount"];
            this.id = data["id"];
        }
    }

    static fromJS(data: any): WarehouseListDto {
        data = typeof data === 'object' ? data : {};
        let result = new WarehouseListDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["code"] = this.code;
        data["updatedTime"] = this.updatedTime ? this.updatedTime.toISOString() : <any>undefined;
        data["memberCount"] = this.memberCount;
        data["workZoneCount"] = this.workZoneCount;
        data["id"] = this.id;
        return data; 
    }
}

export interface IWarehouseListDto {
    code: string | undefined;
    updatedTime: moment.Moment;
    memberCount: number;
    workZoneCount: number;
    id: number;
}

export class PagedResultDtoOfWarehouseListDto implements IPagedResultDtoOfWarehouseListDto {
    totalCount!: number;
    items!: WarehouseListDto[] | undefined;

    constructor(data?: IPagedResultDtoOfWarehouseListDto) {
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
                    this.items!.push(WarehouseListDto.fromJS(item));
            }
        }
    }

    static fromJS(data: any): PagedResultDtoOfWarehouseListDto {
        data = typeof data === 'object' ? data : {};
        let result = new PagedResultDtoOfWarehouseListDto();
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

export interface IPagedResultDtoOfWarehouseListDto {
    totalCount: number;
    items: WarehouseListDto[] | undefined;
}

export class CreateWarehouseInput implements ICreateWarehouseInput {
    organizationUnitId!: number | undefined;
    code!: string | undefined;

    constructor(data?: ICreateWarehouseInput) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.organizationUnitId = data["organizationUnitId"];
            this.code = data["code"];
        }
    }

    static fromJS(data: any): CreateWarehouseInput {
        data = typeof data === 'object' ? data : {};
        let result = new CreateWarehouseInput();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["organizationUnitId"] = this.organizationUnitId;
        data["code"] = this.code;
        return data; 
    }
}

export interface ICreateWarehouseInput {
    organizationUnitId: number | undefined;
    code: string | undefined;
}

export class UpdateWarehouseInput implements IUpdateWarehouseInput {
    id!: number;
    organizationUnitId!: number | undefined;
    code!: string | undefined;

    constructor(data?: IUpdateWarehouseInput) {
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
            this.organizationUnitId = data["organizationUnitId"];
            this.code = data["code"];
        }
    }

    static fromJS(data: any): UpdateWarehouseInput {
        data = typeof data === 'object' ? data : {};
        let result = new UpdateWarehouseInput();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["organizationUnitId"] = this.organizationUnitId;
        data["code"] = this.code;
        return data; 
    }
}

export interface IUpdateWarehouseInput {
    id: number;
    organizationUnitId: number | undefined;
    code: string | undefined;
}

export class GetWarehouseMasterInput implements IGetWarehouseMasterInput {
    whse_code!: string | undefined;
    whse_name!: string | undefined;
    status!: string | undefined;
    country!: string | undefined;
    state!: string | undefined;
    city!: string | undefined;
    address!: string | undefined;
    address1!: string | undefined;
    address2!: string | undefined;
    zip!: string | undefined;
    contact!: string | undefined;
    contact_tel!: string | undefined;
    contact_fax!: string | undefined;
    contact_email!: string | undefined;
    contact_title!: string | undefined;
    remarks!: string | undefined;
    lookupDesc!: string | undefined;
    id?: number;
    
    constructor(data?: IWarehouseMasterDto) {
        if (data) {
            for (var property in data) {
                if(data.hasOwnProperty(property))
                (<any>this)[property] = (<any>this)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.id = data["id"];
            this.whse_code = data["whse_code"];
            this.whse_name = data["whse_name"];
            this.status = data["status"];
            this.country = data["country"];
            this.state = data["state"];
            this.city = data["city"];
            this.address = data["address"];
            this.address1 = data["address1"];
            this.address2 = data["address2"];
            this.zip = data["zip"];
            this.contact = data["contact"];
            this.contact_tel = data["contact_tel"];
            this.contact_fax = data["contact_fax"];
            this.contact_email = data["contact_email"];
            this.contact_title = data["contact_title"];
            this.remarks = data["remarks"];
            this.lookupDesc = data["lookupDesc"];
        }
    }

    static fromJS(data: any): GetWarehouseMasterInput {
        data = typeof data === 'object' ? data : {};
        let result = new GetWarehouseMasterInput();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["whse_code"]  = this.whse_code;
        data["whse_name"]  = this.whse_name;
        data["status"]  = this.status;
        data["country"]  = this.country;
        data["state"]  = this.state;
        data["city"]  = this.city;
        data["address"]  = this.address;
        data["address1"]  = this.address1;
        data["address2"]  = this.address2;
        data["zip"]  = this.zip;
        data["contact"]  = this.contact;
        data["contact_tel"]  = this.contact_tel;
        data["contact_fax"]  = this.contact_fax;
        data["contact_email"]  = this.contact_email;
        data["contact_title"]  = this.contact_title;
        data["remarks"]  = this.remarks;
        data["id"] = this.id;

        return data;
    }
}

export interface IGetWarehouseMasterInput {
    whse_code: string | undefined;
    whse_name: string | undefined;
    status: string | undefined;
    country: string | undefined;
    state: string | undefined;
    city: string | undefined;
    address: string | undefined;
    address1: string | undefined;
    address2: string | undefined;
    zip: string | undefined;
    contact: string | undefined;
    contact_tel: string | undefined;
    contact_fax: string | undefined;
    contact_email: string | undefined;
    contact_title: string | undefined;
    remarks: string | undefined;
    lookupDesc: string | undefined;
    id?: number;
}

export interface IWarehouseMasterDto {
    whse_code: string | undefined;
    whse_name: string | undefined;
    status: string | undefined;
    country: string | undefined;
    state: string | undefined;
    city: string | undefined;
    address: string | undefined;
    address1: string | undefined;
    address2: string | undefined;
    zip: string | undefined;
    contact: string | undefined;
    contact_tel: string | undefined;
    contact_fax: string | undefined;
    contact_email: string | undefined;
    contact_title: string | undefined;
    remarks: string | undefined;
    lookupDesc: string | undefined;
    id:number;
}

export class PagedResultDtoOfWarehouseMasterDto implements IPagedResultDtoOfWarehouseMasterDto {
    totalCount!: number;
    items!: WarehouseMasterDto[] | undefined;

    constructor(data?: IPagedResultDtoOfWarehouseMasterDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any> this)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.totalCount = data["totalCount"];
            if (Array.isArray(data["items"])) {
                this.items = [] as any;
                for (let item of data["items"])
                    this.items!.push(WarehouseMasterDto.fromJS(item));
            }
        }
    }

    static fromJS(data: any): PagedResultDtoOfWarehouseMasterDto {
        data = typeof data === 'object' ? data : {};
        let result = new PagedResultDtoOfWarehouseMasterDto();
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

export interface IPagedResultDtoOfWarehouseMasterDto {
    totalCount: number;
    items: WarehouseMasterDto[] | undefined;
}

export class WarehouseMasterDto implements IWarehouseMasterDto {
    whse_code!: string | undefined;
    whse_name!: string | undefined;
    status!: string | undefined;
    country!: string | undefined;
    state!: string | undefined;
    city!: string | undefined;
    address!: string | undefined;
    address1!: string | undefined;
    address2!: string | undefined;
    zip!: string | undefined;
    contact!: string | undefined;
    contact_tel!: string | undefined;
    contact_fax!: string | undefined;
    contact_email!: string | undefined;
    contact_title!: string | undefined;
    remarks!: string | undefined;
    lookupDesc!: string | undefined;
    id!:number;

    constructor(data?: IWarehouseMasterDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>this)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.whse_code = data["whse_code"];
            this.whse_name = data["whse_name"];
            this.status = data["status"];
            this.country = data["country"];
            this.state = data["state"];
            this.city = data["city"];
            this.address = data["address"];
            this.address1 = data["address1"];
            this.address2 = data["address2"];
            this.zip = data["zip"];
            this.contact = data["contact"];
            this.contact_tel = data["contact_tel"];
            this.contact_fax = data["contact_fax"];
            this.contact_email = data["contact_email"];
            this.contact_title = data["contact_title"];
            this.remarks = data["remarks"];
            this.lookupDesc = data["lookupDesc"];
            this.id = data["id"];
        }
    }

    static fromJS(data: any): WarehouseMasterDto {
        data = typeof data === 'object' ? data : {};
        let result = new WarehouseMasterDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["whse_code"] = this.whse_code;
        data["whse_name"] = this.whse_name;
        data["status"] = this.status;
        data["country"] = this.country;
        data["state"] = this.state;
        data["city"] = this.city;
        data["address"] = this.address;
        data["address1"] = this.address1;
        data["address2"] = this.address2;
        data["zip"] = this.zip;
        data["contact"] = this.contact;
        data["contact_tel"] = this.contact_tel;
        data["contact_fax"] = this.contact_fax;
        data["contact_email"] = this.contact_email;
        data["contact_title"] = this.contact_title;
        data["remarks"] = this.remarks;
        data["lookupDesc"] = this.lookupDesc;
        data["id"] = this.id;
        return data; 
    }

}