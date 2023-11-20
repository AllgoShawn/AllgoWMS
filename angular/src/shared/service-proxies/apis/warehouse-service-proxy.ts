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
