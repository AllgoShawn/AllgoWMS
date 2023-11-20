import { mergeMap as _observableMergeMap, catchError as _observableCatch } from 'rxjs/operators';
import { Observable, throwError as _observableThrow, of as _observableOf } from 'rxjs';
import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpResponseBase } from '@angular/common/http';

import * as moment from 'moment';

import {
    API_BASE_URL,
    throwException,
    blobToText,
    FindOrganizationUnitUsersInput,
    PagedResultDtoOfNameValueDto,
    UsersToOrganizationUnitInput
} from '@shared/service-proxies/service-proxies';

@Injectable()
export class OrganizationUnitCustomServiceProxy {
    private http: HttpClient;
    private baseUrl: string;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    constructor(@Inject(HttpClient) http: HttpClient, @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
        this.http = http;
        this.baseUrl = baseUrl ? baseUrl : "";
    }

    getOrganizationUnits(storeCode: string | undefined, sorting: string | undefined, maxResultCount: number | undefined, skipCount: number | undefined): Observable<PagedResultDtoOfOrganizationUnitListDto> {
        let url_ = this.baseUrl + "/api/services/app/OrganizationUnitCustom/GetOrganizationUnits?";
        if (storeCode !== undefined)
            url_ += "StoreCode=" + encodeURIComponent("" + storeCode) + "&"; 
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
            return this.processGetOrganizationUnits(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetOrganizationUnits(<any>response_);
                } catch (e) {
                    return <Observable<PagedResultDtoOfOrganizationUnitListDto>><any>_observableThrow(e);
                }
            } else
                return <Observable<PagedResultDtoOfOrganizationUnitListDto>><any>_observableThrow(response_);
        }));
    }

    protected processGetOrganizationUnits(response: HttpResponseBase): Observable<PagedResultDtoOfOrganizationUnitListDto> {
        const status = response.status;
        const responseBlob = 
            response instanceof HttpResponse ? response.body : 
            (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = PagedResultDtoOfOrganizationUnitListDto.fromJS(resultData200);
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<PagedResultDtoOfOrganizationUnitListDto>(<any>null);
    }

    findUsers(body: FindOrganizationUnitUsersInput | undefined): Observable<PagedResultDtoOfNameValueDto> {
        let url_ = this.baseUrl + "/api/services/app/OrganizationUnitCustom/FindUsers";
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
}


export class PagedResultDtoOfOrganizationUnitListDto implements IPagedResultDtoOfOrganizationUnitListDto {
    totalCount!: number;
    items!: OrganizationUnitDto[] | undefined;

    constructor(data?: IPagedResultDtoOfOrganizationUnitListDto) {
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
                    this.items!.push(OrganizationUnitDto.fromJS(item));
            }
        }
    }

    static fromJS(data: any): PagedResultDtoOfOrganizationUnitListDto {
        data = typeof data === 'object' ? data : {};
        let result = new PagedResultDtoOfOrganizationUnitListDto();
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

export interface IPagedResultDtoOfOrganizationUnitListDto {
    totalCount: number;
    items: OrganizationUnitDto[] | undefined;
}

export class OrganizationUnitDto implements IOrganizationUnitDto {
    parentId!: number | undefined;
    code!: string | undefined;
    displayName!: string | undefined;
    type!: string | undefined;
    warehouseCount!: number;
    lastModificationTime!: moment.Moment | undefined;
    lastModifierUserId!: number | undefined;
    creationTime!: moment.Moment;
    creatorUserId!: number | undefined;
    id!: number;

    constructor(data?: IOrganizationUnitDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.parentId = data["parentId"];
            this.code = data["code"];
            this.displayName = data["displayName"];
            this.type = data["type"];
            this.warehouseCount = data["warehouseCount"];
            this.lastModificationTime = data["lastModificationTime"] ? moment(data["lastModificationTime"].toString()) : <any>undefined;
            this.lastModifierUserId = data["lastModifierUserId"];
            this.creationTime = data["creationTime"] ? moment(data["creationTime"].toString()) : <any>undefined;
            this.creatorUserId = data["creatorUserId"];
            this.id = data["id"];
        }
    }

    static fromJS(data: any): OrganizationUnitDto {
        data = typeof data === 'object' ? data : {};
        let result = new OrganizationUnitDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["parentId"] = this.parentId;
        data["code"] = this.code;
        data["displayName"] = this.displayName;
        data["type"] = this.type;
        data["warehouseCount"] = this.warehouseCount;
        data["lastModificationTime"] = this.lastModificationTime ? this.lastModificationTime.toISOString() : <any>undefined;
        data["lastModifierUserId"] = this.lastModifierUserId;
        data["creationTime"] = this.creationTime ? this.creationTime.toISOString() : <any>undefined;
        data["creatorUserId"] = this.creatorUserId;
        data["id"] = this.id;
        return data; 
    }
}

export interface IOrganizationUnitDto {
    parentId: number | undefined;
    code: string | undefined;
    displayName: string | undefined;
    type: string | undefined;
    warehouseCount: number;
    lastModificationTime: moment.Moment | undefined;
    lastModifierUserId: number | undefined;
    creationTime: moment.Moment;
    creatorUserId: number | undefined;
    id: number;
}

export class OrganizationUnitUserListDto implements IOrganizationUnitUserListDto {
    name!: string | undefined;
    surname!: string | undefined;
    userName!: string | undefined;
    emailAddress!: string | undefined;
    profilePictureId!: string | undefined;
    addedTime!: moment.Moment;
    userRole!: string | undefined;
    id!: number;

    constructor(data?: IOrganizationUnitUserListDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.name = data["name"];
            this.surname = data["surname"];
            this.userName = data["userName"];
            this.emailAddress = data["emailAddress"];
            this.profilePictureId = data["profilePictureId"];
            this.addedTime = data["addedTime"] ? moment(data["addedTime"].toString()) : <any>undefined;
            this.userRole = data["userRole"];
            this.id = data["id"];
        }
    }

    static fromJS(data: any): OrganizationUnitUserListDto {
        data = typeof data === 'object' ? data : {};
        let result = new OrganizationUnitUserListDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["name"] = this.name;
        data["surname"] = this.surname;
        data["userName"] = this.userName;
        data["emailAddress"] = this.emailAddress;
        data["profilePictureId"] = this.profilePictureId;
        data["addedTime"] = this.addedTime ? this.addedTime.toISOString() : <any>undefined;
        data["userRole"] = this.userRole;
        data["id"] = this.id;
        return data; 
    }
}

export interface IOrganizationUnitUserListDto {
    name: string | undefined;
    surname: string | undefined;
    userName: string | undefined;
    emailAddress: string | undefined;
    profilePictureId: string | undefined;
    addedTime: moment.Moment;
    userRole: string | undefined;
    id: number;
}

export class PagedResultDtoOfOrganizationUnitUserListDto implements IPagedResultDtoOfOrganizationUnitUserListDto {
    totalCount!: number;
    items!: OrganizationUnitUserListDto[] | undefined;

    constructor(data?: IPagedResultDtoOfOrganizationUnitUserListDto) {
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
                    this.items!.push(OrganizationUnitUserListDto.fromJS(item));
            }
        }
    }

    static fromJS(data: any): PagedResultDtoOfOrganizationUnitUserListDto {
        data = typeof data === 'object' ? data : {};
        let result = new PagedResultDtoOfOrganizationUnitUserListDto();
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

export interface IPagedResultDtoOfOrganizationUnitUserListDto {
    totalCount: number;
    items: OrganizationUnitUserListDto[] | undefined;
}