import { mergeMap as _observableMergeMap, catchError as _observableCatch } from 'rxjs/operators';
import { Observable, throwError as _observableThrow, of as _observableOf } from 'rxjs';
import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpResponseBase } from '@angular/common/http';

import * as moment from 'moment';

import {
    API_BASE_URL,
    throwException,
    blobToText,
    PagedResultDtoOfNameValueDto,
    ListResultDtoOfNameValueDto
} from '@shared/service-proxies/service-proxies';

import { WarehouseListDto } from '@shared/service-proxies/apis/warehouse-service-proxy';

@Injectable()
export class WorkZoneServiceProxy {
    private http: HttpClient;
    private baseUrl: string;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    constructor(@Inject(HttpClient) http: HttpClient, @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
        this.http = http;
        this.baseUrl = baseUrl ? baseUrl : "";
    }

    getWorkZones(organizationUnitId: number | undefined, filter: string | undefined, type: string | undefined, warehouseId: number | undefined, sorting: string | undefined, maxResultCount: number | undefined, skipCount: number | undefined): Observable<PagedResultDtoOfWorkZoneListDto> {
        let url_ = this.baseUrl + "/api/services/app/WorkZone/GetWorkZones?";
        if (organizationUnitId === null)
            throw new Error("The parameter 'OrganizationUnitId' cannot be null.");
        else if (organizationUnitId !== undefined)
            url_ += "organizationUnitId=" + encodeURIComponent("" + organizationUnitId) + "&";
        if (warehouseId > 0)
            url_ += "warehouseId=" + encodeURIComponent("" + warehouseId) + "&"; 
        if (filter !== undefined)
            url_ += "Filter=" + encodeURIComponent("" + filter) + "&"; 
        if (type !== undefined)
            url_ += "Type=" + encodeURIComponent("" + type) + "&"; 
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
            return this.processGetWorkZones(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetWorkZones(<any>response_);
                } catch (e) {
                    return <Observable<PagedResultDtoOfWorkZoneListDto>><any>_observableThrow(e);
                }
            } else
                return <Observable<PagedResultDtoOfWorkZoneListDto>><any>_observableThrow(response_);
        }));
    }

    protected processGetWorkZones(response: HttpResponseBase): Observable<PagedResultDtoOfWorkZoneListDto> {
        const status = response.status;
        const responseBlob = 
            response instanceof HttpResponse ? response.body : 
            (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = PagedResultDtoOfWorkZoneListDto.fromJS(resultData200);
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<PagedResultDtoOfWorkZoneListDto>(<any>null);
    }

    getWarehouses(id: number | undefined): Observable<ListResultDtoOfWarehouseListDto> {
        let url_ = this.baseUrl + "/api/services/app/WorkZone/GetWarehouses?";
        if (id === null)
            throw new Error("The parameter 'id' cannot be null.");
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
            return this.processGetWarehouses(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetWarehouses(<any>response_);
                } catch (e) {
                    return <Observable<ListResultDtoOfWarehouseListDto>><any>_observableThrow(e);
                }
            } else
                return <Observable<ListResultDtoOfWarehouseListDto>><any>_observableThrow(response_);
        }));
    }

    protected processGetWarehouses(response: HttpResponseBase): Observable<ListResultDtoOfWarehouseListDto> {
        const status = response.status;
        const responseBlob = 
            response instanceof HttpResponse ? response.body : 
            (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = ListResultDtoOfWarehouseListDto.fromJS(resultData200);
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<ListResultDtoOfWarehouseListDto>(<any>null);
    }

    createWorkZone(body: CreateWorkZoneInput | undefined): Observable<void> {
        let url_ = this.baseUrl + "/api/services/app/WorkZone/CreateWorkZone";
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
            return this.processCreateWorkZone(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processCreateWorkZone(<any>response_);
                } catch (e) {
                    return <Observable<void>><any>_observableThrow(e);
                }
            } else
                return <Observable<void>><any>_observableThrow(response_);
        }));
    }

    protected processCreateWorkZone(response: HttpResponseBase): Observable<void> {
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

    updateWorkZone(body: UpdateWorkZoneInput | undefined): Observable<void>{
        let url_ = this.baseUrl + "/api/services/app/WorkZone/UpdateWorkZone";
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
            return this.processUpdateWorkZone(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processUpdateWorkZone(<any>response_);
                } catch (e) {
                    return <Observable<void>><any>_observableThrow(e);
                }
            } else
                return <Observable<void>><any>_observableThrow(response_);
        }));
    }

    protected processUpdateWorkZone(response: HttpResponseBase): Observable<void> {
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

    deleteWorkZone(body: UpdateWorkZoneInput | undefined): Observable<void>{
        let url_ = this.baseUrl + "/api/services/app/WorkZone/UpdateToDeleteWorkZone";
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
            return this.processUpdateWorkZone(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processUpdateWorkZone(<any>response_);
                } catch (e) {
                    return <Observable<void>><any>_observableThrow(e);
                }
            } else
                return <Observable<void>><any>_observableThrow(response_);
        }));
    }

    protected processDeleteWorkZone(response: HttpResponseBase): Observable<void> {
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
    
    findUsers(body: FindWorkZoneUsersInput | undefined): Observable<PagedResultDtoOfNameValueDto> {
        let url_ = this.baseUrl + "/api/services/app/WorkZone/FindWorkZoneUsers";
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
            return this.processFindUsers(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processFindUsers(<any>response_);
                } catch (e) {
                    return <Observable<PagedResultDtoOfNameValueDto>><any>_observableThrow(e);
                }
            } else
                return <Observable<PagedResultDtoOfNameValueDto>><any>_observableThrow(response_);
        }));
    }

    protected processFindUsers(response: HttpResponseBase): Observable<PagedResultDtoOfNameValueDto> {
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
    
    findSelectedUsers(body: FindWorkZoneUsersInput | undefined): Observable<ListResultDtoOfNameValueDto> {
        let url_ = this.baseUrl + "/api/services/app/WorkZone/FindSelectedWorkZoneUsers";
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
            return this.processFindSelectedUsers(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processFindSelectedUsers(<any>response_);
                } catch (e) {
                    return <Observable<ListResultDtoOfNameValueDto>><any>_observableThrow(e);
                }
            } else
                return <Observable<ListResultDtoOfNameValueDto>><any>_observableThrow(response_);
        }));
    }

    protected processFindSelectedUsers(response: HttpResponseBase): Observable<ListResultDtoOfNameValueDto> {
        const status = response.status;
        const responseBlob = 
            response instanceof HttpResponse ? response.body : 
            (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = ListResultDtoOfNameValueDto.fromJS(resultData200);
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<ListResultDtoOfNameValueDto>(<any>null);
    }

    addUsersToWorkZone  (body: UsersToWorkZoneInput | undefined): Observable<void> {
        let url_ = this.baseUrl + "/api/services/app/WorkZone/AddUsersToWorkZone";
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
            return this.processAddUsersToWorkZone(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processAddUsersToWorkZone(<any>response_);
                } catch (e) {
                    return <Observable<void>><any>_observableThrow(e);
                }
            } else
                return <Observable<void>><any>_observableThrow(response_);
        }));
    }

    protected processAddUsersToWorkZone(response: HttpResponseBase): Observable<void> {
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

export class WorkZoneListDto implements IWorkZoneListDto {
    code!: string | undefined;
    type!: string | undefined;
    warehouseCode!: string | undefined;
    warehouseId!: number | undefined;
    updatedTime!: moment.Moment;
    memberCount!: number;
    id!: number;

    constructor(data?: IWorkZoneListDto) {
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
            this.type = data["type"];
            this.warehouseCode = data["warehouseCode"];
            this.warehouseId = data["warehouseId"];
            this.updatedTime = data["updatedTime"] ? moment(data["updatedTime"].toString()) : <any>undefined;
            this.memberCount = data["memberCount"];
            this.id = data["id"];
        }
    }

    static fromJS(data: any): WorkZoneListDto {
        data = typeof data === 'object' ? data : {};
        let result = new WorkZoneListDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["code"] = this.code;
        data["type"] = this.type;
        data["warehouseCode"] = this.warehouseCode;
        data["warehouseId"] = this.warehouseId;
        data["updatedTime"] = this.updatedTime ? this.updatedTime.toISOString() : <any>undefined;
        data["memberCount"] = this.memberCount;
        data["id"] = this.id;
        return data; 
    }
}

export interface IWorkZoneListDto {
    code: string | undefined;
    type: string | undefined;
    warehouseCode: string | undefined;
    warehouseId: number | undefined;
    updatedTime: moment.Moment;
    memberCount: number;
    id: number;
}

export class PagedResultDtoOfWorkZoneListDto implements IPagedResultDtoOfWorkZoneListDto {
    totalCount!: number;
    items!: WorkZoneListDto[] | undefined;

    constructor(data?: IPagedResultDtoOfWorkZoneListDto) {
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
                    this.items!.push(WorkZoneListDto.fromJS(item));
            }
        }
    }

    static fromJS(data: any): PagedResultDtoOfWorkZoneListDto {
        data = typeof data === 'object' ? data : {};
        let result = new PagedResultDtoOfWorkZoneListDto();
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

export interface IPagedResultDtoOfWorkZoneListDto {
    totalCount: number;
    items: WorkZoneListDto[] | undefined;
}

export class ListResultDtoOfWarehouseListDto implements IListResultDtoOfWarehouseListDto {
    items!: WarehouseListDto[] | undefined;

    constructor(data?: IListResultDtoOfWarehouseListDto) {
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
                    this.items!.push(WarehouseListDto.fromJS(item));
            }
        }
    }

    static fromJS(data: any): ListResultDtoOfWarehouseListDto {
        data = typeof data === 'object' ? data : {};
        let result = new ListResultDtoOfWarehouseListDto();
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

export interface IListResultDtoOfWarehouseListDto {
    items: WarehouseListDto[] | undefined;
}

export class CreateWorkZoneInput implements ICreateWorkZoneInput {
    organizationUnitId!: number | undefined;
    warehouseId!: number | undefined;
    code!: string | undefined;
    type?: string | undefined;

    constructor(data?: ICreateWorkZoneInput) {
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
            this.warehouseId = data["warehouseId"];
            this.code = data["code"];
            this.type = data["type"];
        }
    }

    static fromJS(data: any): CreateWorkZoneInput {
        data = typeof data === 'object' ? data : {};
        let result = new CreateWorkZoneInput();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["organizationUnitId"] = this.organizationUnitId;
        data["warehouseId"] = this.warehouseId;
        data["code"] = this.code;
        data["type"] = this.type;
        return data; 
    }
}

export interface ICreateWorkZoneInput {
    organizationUnitId: number | undefined;
    warehouseId: number | undefined;
    code: string | undefined;
    type?: string | undefined;
}

export class UpdateWorkZoneInput implements IUpdateWorkZoneInput {
    id!: number;
    organizationUnitId!: number | undefined;
    warehouseId!: number | undefined;
    code!: string | undefined;
    type?: string | undefined;

    constructor(data?: IUpdateWorkZoneInput) {
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
            this.warehouseId = data["warehouseId"];
            this.code = data["code"];
            this.type = data["type"];
        }
    }

    static fromJS(data: any): UpdateWorkZoneInput {
        data = typeof data === 'object' ? data : {};
        let result = new UpdateWorkZoneInput();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["organizationUnitId"] = this.organizationUnitId;
        data["warehouseId"] = this.warehouseId;
        data["code"] = this.code;
        data["type"] = this.type;
        return data; 
    }
}

export interface IUpdateWorkZoneInput {
    id: number;
    organizationUnitId: number | undefined;
    warehouseId: number | undefined;
    code: string | undefined;
    type?: string | undefined;
}

export class FindWorkZoneUsersInput implements IFindWorkZoneUsersInput {
    workZoneId!: number;
    type!: string | undefined;
    maxResultCount!: number;
    skipCount!: number;
    filter!: string | undefined;

    constructor(data?: IFindWorkZoneUsersInput) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.workZoneId = data["workZoneId"];
            this.type = data["type"];
            this.maxResultCount = data["maxResultCount"];
            this.skipCount = data["skipCount"];
            this.filter = data["filter"];
        }
    }

    static fromJS(data: any): FindWorkZoneUsersInput {
        data = typeof data === 'object' ? data : {};
        let result = new FindWorkZoneUsersInput();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["workZoneId"] = this.workZoneId;
        data["type"] = this.type;
        data["maxResultCount"] = this.maxResultCount;
        data["skipCount"] = this.skipCount;
        data["filter"] = this.filter;
        return data; 
    }
}

export interface IFindWorkZoneUsersInput {
    workZoneId: number;
    type: string | undefined;
    maxResultCount: number;
    skipCount: number;
    filter: string | undefined;
}

export class UsersToWorkZoneInput implements IUsersToWorkZoneInput {
    userIds!: number[] | undefined;
    workZoneId!: number;

    constructor(data?: IUsersToWorkZoneInput) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            if (Array.isArray(data["userIds"])) {
                this.userIds = [] as any;
                for (let item of data["userIds"])
                    this.userIds!.push(item);
            }
            this.workZoneId = data["workZonetId"];
        }
    }

    static fromJS(data: any): UsersToWorkZoneInput {
        data = typeof data === 'object' ? data : {};
        let result = new UsersToWorkZoneInput();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        if (Array.isArray(this.userIds)) {
            data["userIds"] = [];
            for (let item of this.userIds)
                data["userIds"].push(item);
        }
        data["workZoneId"] = this.workZoneId;
        return data; 
    }
}

export interface IUsersToWorkZoneInput {
    userIds: number[] | undefined;
    workZoneId: number;
}
