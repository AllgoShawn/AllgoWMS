import { mergeMap as _observableMergeMap, catchError as _observableCatch } from 'rxjs/operators';
import { Observable, throwError as _observableThrow, of as _observableOf } from 'rxjs';
import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpResponseBase } from '@angular/common/http';

import * as moment from 'moment';

import {
    API_BASE_URL,
    throwException,
    blobToText,
    FileDto,
    PagedResultDtoOfNameValueDto
} from '@shared/service-proxies/service-proxies';

@Injectable()
export class InventoryServiceProxy {
    private http: HttpClient;
    private baseUrl: string;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    constructor(@Inject(HttpClient) http: HttpClient, @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
        this.http = http;
        this.baseUrl = baseUrl ? baseUrl : "";
    }

    getInventoryMasters(
        filter: string | undefined,  
        organizationFilter: string | undefined, 
        warehouseFilter: string | undefined, 
        skuFilter: string | undefined,
        // lotNumFilter: string | undefined,
        descrFilter: string | undefined,
        minQtyFilter: number | undefined,
        maxQtyFilter: number | undefined,
        minQtyAllocatedFilter: number | undefined,
        maxQtyAllocatedFilter: number | undefined,
        minQtyDamagedFilter: number | undefined,
        maxQtyDamagedFilter: number | undefined,
        minQtyInTransitFilter: number | undefined,
        maxQtyInTransitFilter: number | undefined,
        sorting: string | undefined, 
        maxResultCount: number | undefined, 
        skipCount: number | undefined
    ): Observable<PagedResultDtoOfInventoryListDto> {
        let url_ = this.baseUrl + "/api/services/app/Inventory/GetInventoryListing?";
        if (filter !== undefined)
            url_ += "Filter=" + encodeURIComponent("" + filter) + "&"; 
        if (organizationFilter !== undefined)
            url_ += "OrganizationFilter=" + encodeURIComponent("" + organizationFilter) + "&"; 
        if (warehouseFilter !== undefined)
            url_ += "WarehouseFilter=" + encodeURIComponent("" + warehouseFilter) + "&"; 
        if (skuFilter !== undefined)
            url_ += "SkuFilter=" + encodeURIComponent("" + skuFilter) + "&";
        // if (lotNumFilter !== undefined)
        //     url_ += "LotNumFilter=" + encodeURIComponent("" + lotNumFilter) + "&";
        if (descrFilter !== undefined)
            url_ += "DescrFilter=" + encodeURIComponent("" + descrFilter) + "&";
        if (minQtyFilter != null && minQtyFilter !== undefined)
            url_ += "MinQtyFilter=" + encodeURIComponent("" + minQtyFilter) + "&";
        if (maxQtyFilter != null && maxQtyFilter !== undefined)
            url_ += "MaxQtyFilter=" + encodeURIComponent("" + maxQtyFilter) + "&";
        if (minQtyAllocatedFilter != null && minQtyAllocatedFilter !== undefined)
            url_ += "MinQtyAllocatedFilter=" + encodeURIComponent("" + minQtyAllocatedFilter) + "&";
        if (maxQtyAllocatedFilter != null && maxQtyAllocatedFilter !== undefined)
            url_ += "MaxQtyAllocatedFilter=" + encodeURIComponent("" + maxQtyAllocatedFilter) + "&";
        if (minQtyDamagedFilter != null && minQtyDamagedFilter !== undefined)
            url_ += "MinQtyDamagedFilter=" + encodeURIComponent("" + minQtyDamagedFilter) + "&";
        if (maxQtyDamagedFilter != null && maxQtyDamagedFilter !== undefined)
            url_ += "MaxQtyDamagedFilter=" + encodeURIComponent("" + maxQtyDamagedFilter) + "&";
        if (minQtyInTransitFilter != null && minQtyInTransitFilter !== undefined)
            url_ += "MinQtyInTransitFilter=" + encodeURIComponent("" + minQtyInTransitFilter) + "&";
        if (maxQtyInTransitFilter != null && maxQtyInTransitFilter !== undefined)
            url_ += "MaxQtyInTransitFilter=" + encodeURIComponent("" + maxQtyInTransitFilter) + "&";
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
            return this.processGetInventoryMasters(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetInventoryMasters(<any>response_);
                } catch (e) {
                    return <Observable<PagedResultDtoOfInventoryListDto>><any>_observableThrow(e);
                }
            } else
                return <Observable<PagedResultDtoOfInventoryListDto>><any>_observableThrow(response_);
        }));
    }

    getHostInventoryMasters(
        filter: string | undefined,  
        organizationFilter: string | undefined, 
        warehouseFilter: string | undefined, 
        skuFilter: string | undefined,
        // lotNumFilter: string | undefined,
        descrFilter: string | undefined,
        minQtyFilter: number | undefined,
        maxQtyFilter: number | undefined,
        minQtyAllocatedFilter: number | undefined,
        maxQtyAllocatedFilter: number | undefined,
        minQtyDamagedFilter: number | undefined,
        maxQtyDamagedFilter: number | undefined,
        minQtyInTransitFilter: number | undefined,
        maxQtyInTransitFilter: number | undefined,
        sorting: string | undefined, 
        maxResultCount: number | undefined, 
        skipCount: number | undefined
    ): Observable<PagedResultDtoOfInventoryListDto> {
        let url_ = this.baseUrl + "/api/services/app/HostInventory/GetInventoryListing?";
        if (filter !== undefined)
            url_ += "Filter=" + encodeURIComponent("" + filter) + "&"; 
        if (organizationFilter !== undefined)
            url_ += "OrganizationFilter=" + encodeURIComponent("" + organizationFilter) + "&"; 
        if (warehouseFilter !== undefined)
            url_ += "WarehouseFilter=" + encodeURIComponent("" + warehouseFilter) + "&"; 
        if (skuFilter !== undefined)
            url_ += "SkuFilter=" + encodeURIComponent("" + skuFilter) + "&";
        // if (lotNumFilter !== undefined)
        //     url_ += "LotNumFilter=" + encodeURIComponent("" + lotNumFilter) + "&";
        if (descrFilter !== undefined)
            url_ += "DescrFilter=" + encodeURIComponent("" + descrFilter) + "&";
        if (minQtyFilter != null && minQtyFilter !== undefined)
            url_ += "MinQtyFilter=" + encodeURIComponent("" + minQtyFilter) + "&";
        if (maxQtyFilter != null && maxQtyFilter !== undefined)
            url_ += "MaxQtyFilter=" + encodeURIComponent("" + maxQtyFilter) + "&";
        if (minQtyAllocatedFilter != null && minQtyAllocatedFilter !== undefined)
            url_ += "MinQtyAllocatedFilter=" + encodeURIComponent("" + minQtyAllocatedFilter) + "&";
        if (maxQtyAllocatedFilter != null && maxQtyAllocatedFilter !== undefined)
            url_ += "MaxQtyAllocatedFilter=" + encodeURIComponent("" + maxQtyAllocatedFilter) + "&";
        if (minQtyDamagedFilter != null && minQtyDamagedFilter !== undefined)
            url_ += "MinQtyDamagedFilter=" + encodeURIComponent("" + minQtyDamagedFilter) + "&";
        if (maxQtyDamagedFilter != null && maxQtyDamagedFilter !== undefined)
            url_ += "MaxQtyDamagedFilter=" + encodeURIComponent("" + maxQtyDamagedFilter) + "&";
        if (minQtyInTransitFilter != null && minQtyInTransitFilter !== undefined)
            url_ += "MinQtyInTransitFilter=" + encodeURIComponent("" + minQtyInTransitFilter) + "&";
        if (maxQtyInTransitFilter != null && maxQtyInTransitFilter !== undefined)
            url_ += "MaxQtyInTransitFilter=" + encodeURIComponent("" + maxQtyInTransitFilter) + "&";
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
            return this.processGetInventoryMasters(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetInventoryMasters(<any>response_);
                } catch (e) {
                    return <Observable<PagedResultDtoOfInventoryListDto>><any>_observableThrow(e);
                }
            } else
                return <Observable<PagedResultDtoOfInventoryListDto>><any>_observableThrow(response_);
        }));
    }

    protected processGetInventoryMasters(response: HttpResponseBase): Observable<PagedResultDtoOfInventoryListDto> {
        const status = response.status;
        const responseBlob = 
            response instanceof HttpResponse ? response.body : 
            (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = PagedResultDtoOfInventoryListDto.fromJS(resultData200);
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<PagedResultDtoOfInventoryListDto>(<any>null);
    }

    getAvailableQtyFromWarehouses(
        organizationId: string | undefined,  
        warehouseId: string | undefined,  
        consigneeId: string | undefined
    ): Observable<InventoryItemListDto> {
        let url_ = this.baseUrl + "/api/services/app/HostInventory/GetAvailableQtyFromWarehouses?";
        if (organizationId === null)
            throw new Error("The parameter 'Organization Id' cannot be null.");
        else if (organizationId !== undefined)
            url_ += "organizationId=" + encodeURIComponent("" + organizationId) + "&"; 
        if (warehouseId === null)
            throw new Error("The parameter 'Transfer From Location' cannot be null.");
        else if (warehouseId !== undefined)
            url_ += "warehouseId=" + encodeURIComponent("" + warehouseId) + "&"; 
        if (consigneeId === null)
            throw new Error("The parameter 'Transfer To Location' cannot be null.");
        else if (consigneeId !== undefined)
            url_ += "consigneeId=" + encodeURIComponent("" + consigneeId) + "&"; 
        url_ = url_.replace(/[?&]$/, "");

        let options_ : any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Accept": "text/plain"
            })
        };

        return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processGetAvailableQtyFromWarehouses(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetAvailableQtyFromWarehouses(<any>response_);
                } catch (e) {
                    return <Observable<InventoryItemListDto>><any>_observableThrow(e);
                }
            } else
                return <Observable<InventoryItemListDto>><any>_observableThrow(response_);
        }));
    }

    protected processGetAvailableQtyFromWarehouses(response: HttpResponseBase): Observable<InventoryItemListDto> {
        const status = response.status;
        const responseBlob = 
            response instanceof HttpResponse ? response.body : 
            (<any>response).error instanceof Blob ? (<any>response).error : undefined;
  
        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            
            result200 = InventoryItemListDto.fromJS(resultData200);
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<InventoryItemListDto>(<any>null);
    }

    exportInventoryMasters(
        filter: string | undefined,  
        organizationFilter: string | undefined, 
        warehouseFilter: string | undefined, 
        skuFilter: string | undefined,
        // lotNumFilter: string | undefined,
        descrFilter: string | undefined,
        minQtyFilter: number | undefined,
        maxQtyFilter: number | undefined,
        minQtyAllocatedFilter: number | undefined,
        maxQtyAllocatedFilter: number | undefined,
        minQtyDamagedFilter: number | undefined,
        maxQtyDamagedFilter: number | undefined,
        minQtyInTransitFilter: number | undefined,
        maxQtyInTransitFilter: number | undefined,
        sorting: string | undefined, 
        maxResultCount: number | undefined, 
        skipCount: number | undefined
    ): Observable<FileDto> {
        let url_ = this.baseUrl + "/api/services/app/Inventory/GetDataToExportInventoryListing?";
        if (filter !== undefined)
            url_ += "Filter=" + encodeURIComponent("" + filter) + "&"; 
        if (organizationFilter !== undefined)
            url_ += "OrganizationFilter=" + encodeURIComponent("" + organizationFilter) + "&"; 
        if (warehouseFilter !== undefined)
            url_ += "WarehouseFilter=" + encodeURIComponent("" + warehouseFilter) + "&"; 
        if (skuFilter !== undefined)
            url_ += "SkuFilter=" + encodeURIComponent("" + skuFilter) + "&";
        // if (lotNumFilter !== undefined)
        //     url_ += "LotNumFilter=" + encodeURIComponent("" + lotNumFilter) + "&";
        if (descrFilter !== undefined)
            url_ += "DescrFilter=" + encodeURIComponent("" + descrFilter) + "&";
        if (minQtyFilter != null && minQtyFilter !== undefined)
            url_ += "MinQtyFilter=" + encodeURIComponent("" + minQtyFilter) + "&";
        if (maxQtyFilter != null && maxQtyFilter !== undefined)
            url_ += "MaxQtyFilter=" + encodeURIComponent("" + maxQtyFilter) + "&";
        if (minQtyAllocatedFilter != null && minQtyAllocatedFilter !== undefined)
            url_ += "MinQtyAllocatedFilter=" + encodeURIComponent("" + minQtyAllocatedFilter) + "&";
        if (maxQtyAllocatedFilter != null && maxQtyAllocatedFilter !== undefined)
            url_ += "MaxQtyAllocatedFilter=" + encodeURIComponent("" + maxQtyAllocatedFilter) + "&";
        if (minQtyDamagedFilter != null && minQtyDamagedFilter !== undefined)
            url_ += "MinQtyDamagedFilter=" + encodeURIComponent("" + minQtyDamagedFilter) + "&";
        if (maxQtyDamagedFilter != null && maxQtyDamagedFilter !== undefined)
            url_ += "MaxQtyDamagedFilter=" + encodeURIComponent("" + maxQtyDamagedFilter) + "&";
        if (minQtyInTransitFilter != null && minQtyInTransitFilter !== undefined)
            url_ += "MinQtyInTransitFilter=" + encodeURIComponent("" + minQtyInTransitFilter) + "&";
        if (maxQtyInTransitFilter != null && maxQtyInTransitFilter !== undefined)
            url_ += "MaxQtyInTransitFilter=" + encodeURIComponent("" + maxQtyInTransitFilter) + "&";
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
            return this.processExportInventoryMasters(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processExportInventoryMasters(<any>response_);
                } catch (e) {
                    return <Observable<FileDto>><any>_observableThrow(e);
                }
            } else
                return <Observable<FileDto>><any>_observableThrow(response_);
        }));
    }

    protected processExportInventoryMasters(response: HttpResponseBase): Observable<FileDto> {
        const status = response.status;
        const responseBlob = 
            response instanceof HttpResponse ? response.body : 
            (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = FileDto.fromJS(resultData200);
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<FileDto>(<any>null);
    }

    getInventoryBySKUMasters(
        filter: string | undefined,  
        skuFilter: string | undefined,
        warehouseFilter: string | undefined, 
        statusFilter: string | undefined, 
        minQtyFilter: number | undefined,
        maxQtyFilter: number | undefined,
        sorting: string | undefined, 
        maxResultCount: number | undefined, 
        skipCount: number | undefined
    ): Observable<PagedResultDtoOfInventoryBySKUListDto> {
        let url_ = this.baseUrl + "/api/services/app/Inventory/GetInventoryBySKUListing?";
        if (filter !== undefined)
            url_ += "Filter=" + encodeURIComponent("" + filter) + "&";  
        if (skuFilter !== undefined)
            url_ += "SkuFilter=" + encodeURIComponent("" + skuFilter) + "&";
        if (warehouseFilter !== undefined)
            url_ += "WarehouseFilter=" + encodeURIComponent("" + warehouseFilter) + "&"; 
        if (statusFilter !== undefined)
            url_ += "StatusFilter=" + encodeURIComponent("" + statusFilter) + "&";
        if (minQtyFilter != null && minQtyFilter !== undefined)
            url_ += "MinQtyFilter=" + encodeURIComponent("" + minQtyFilter) + "&";
        if (maxQtyFilter != null && maxQtyFilter !== undefined)
            url_ += "MaxQtyFilter=" + encodeURIComponent("" + maxQtyFilter) + "&";
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
            return this.processGetInventoryBySKUMasters(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetInventoryBySKUMasters(<any>response_);
                } catch (e) {
                    return <Observable<PagedResultDtoOfInventoryBySKUListDto>><any>_observableThrow(e);
                }
            } else
                return <Observable<PagedResultDtoOfInventoryBySKUListDto>><any>_observableThrow(response_);
        }));
    }

    protected processGetInventoryBySKUMasters(response: HttpResponseBase): Observable<PagedResultDtoOfInventoryBySKUListDto> {
        const status = response.status;
        const responseBlob = 
            response instanceof HttpResponse ? response.body : 
            (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = PagedResultDtoOfInventoryBySKUListDto.fromJS(resultData200);
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<PagedResultDtoOfInventoryBySKUListDto>(<any>null);
    }

    exportInventoryBySKUMasters(
        filter: string | undefined,  
        skuFilter: string | undefined,
        warehouseFilter: string | undefined, 
        statusFilter: string | undefined, 
        minQtyFilter: number | undefined,
        maxQtyFilter: number | undefined,
        sorting: string | undefined, 
        maxResultCount: number | undefined, 
        skipCount: number | undefined
    ): Observable<FileDto> {
        let url_ = this.baseUrl + "/api/services/app/Inventory/GetDataToExportInventoryBySKUListing?";
        if (filter !== undefined)
            url_ += "Filter=" + encodeURIComponent("" + filter) + "&";  
        if (skuFilter !== undefined)
            url_ += "SkuFilter=" + encodeURIComponent("" + skuFilter) + "&";
        if (warehouseFilter !== undefined)
            url_ += "WarehouseFilter=" + encodeURIComponent("" + warehouseFilter) + "&"; 
        if (statusFilter !== undefined)
            url_ += "StatusFilter=" + encodeURIComponent("" + statusFilter) + "&";
        if (minQtyFilter != null && minQtyFilter !== undefined)
            url_ += "MinQtyFilter=" + encodeURIComponent("" + minQtyFilter) + "&";
        if (maxQtyFilter != null && maxQtyFilter !== undefined)
            url_ += "MaxQtyFilter=" + encodeURIComponent("" + maxQtyFilter) + "&";
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
            return this.processExportInventoryBySKUMasters(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processExportInventoryBySKUMasters(<any>response_);
                } catch (e) {
                    return <Observable<FileDto>><any>_observableThrow(e);
                }
            } else
                return <Observable<FileDto>><any>_observableThrow(response_);
        }));
    }

    protected processExportInventoryBySKUMasters(response: HttpResponseBase): Observable<FileDto> {
        const status = response.status;
        const responseBlob = 
            response instanceof HttpResponse ? response.body : 
            (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = FileDto.fromJS(resultData200);
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<FileDto>(<any>null);
    }

    getWarehousesFromHost(): Observable<PagedResultDtoOfNameValueDto> {
        let url_ = this.baseUrl + "/api/services/app/HostInventory/GetWarehousesFromInventory";
        //url_ = url_.replace(/[?&]$/, "");
 
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
                    return <Observable<PagedResultDtoOfNameValueDto>><any>_observableThrow(e);
                }
            } else
                return <Observable<PagedResultDtoOfNameValueDto>><any>_observableThrow(response_);
        }));
    }
 
    protected processGetWarehouses(response: HttpResponseBase): Observable<PagedResultDtoOfNameValueDto> {
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

export class PagedResultDtoOfInventoryListDto implements IPagedResultDtoOfInventoryListDto {
    totalCount!: number;
    items!: InventoryMasterDto[] | undefined;

    constructor(data?: IPagedResultDtoOfInventoryListDto) {
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
                    this.items!.push(InventoryMasterDto.fromJS(item));
            }
        }
    }

    static fromJS(data: any): PagedResultDtoOfInventoryListDto {
        data = typeof data === 'object' ? data : {};
        let result = new PagedResultDtoOfInventoryListDto();
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

export interface IPagedResultDtoOfInventoryListDto {
    totalCount: number;
    items: InventoryMasterDto[] | undefined;
}

export class InventoryMasterDto implements IInventoryMasterDto {
    organizationId!: string | undefined;
    warehouseId!: string | undefined;
    sku!: string | undefined;
    // lotNum!: string | undefined;
    descr!: string | undefined;
    qty!: number | undefined;
    qtyOrdered!: number | undefined;
    qtyAllocated!: number | undefined;
    qtyDamaged!: number | undefined;
    qtyInTransit!: number | undefined;
    lastModificationTime!: moment.Moment | undefined;
    lastModifierUserId!: number | undefined;
    creationTime!: moment.Moment;
    creatorUserId!: number | undefined;
    id!: number;

    constructor(data?: IInventoryMasterDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        console.log(data);
        if (data) {
            this.organizationId = data["organizationId"];
            this.warehouseId = data["warehouseId"];
            this.sku = data["sku"];
            // this.lotNum = data["lotNum"];
            this.descr = data["descr"];
            this.qty = data["qty"];
            this.qtyOrdered = data["qtyOrdered"];
            this.qtyAllocated = data["qtyAllocated"];
            this.qtyDamaged = data["qtyDamaged"];
            this.qtyInTransit = data["qtyInTransit"];
            this.lastModificationTime = data["lastModificationTime"] ? moment(data["lastModificationTime"].toString()) : <any>undefined;
            this.lastModifierUserId = data["lastModifierUserId"];
            this.creationTime = data["creationTime"] ? moment(data["creationTime"].toString()) : <any>undefined;
            this.creatorUserId = data["creatorUserId"];
            this.id = data["id"];
        }
    }

    static fromJS(data: any): InventoryMasterDto {
        data = typeof data === 'object' ? data : {};
        let result = new InventoryMasterDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["organizationId"] = this.organizationId;
        data["warehouseId"] = this.warehouseId;
        data["sku"] = this.sku;
        // data["lotNum"] = this.lotNum;
        data["descr"] = this.descr;
        data["qty"] = this.qty;
        data["qtyOrdered"] = this.qtyOrdered;
        data["qtyAllocated"] = this.qtyAllocated;
        data["qtyDamaged"] = this.qtyDamaged;
        data["qtyInTransit"] = this.qtyInTransit;
        data["lastModificationTime"] = this.lastModificationTime ? this.lastModificationTime.toISOString() : <any>undefined;
        data["lastModifierUserId"] = this.lastModifierUserId;
        data["creationTime"] = this.creationTime ? this.creationTime.toISOString() : <any>undefined;
        data["creatorUserId"] = this.creatorUserId;
        data["id"] = this.id;
        return data; 
    }
}

export interface IInventoryMasterDto {
    organizationId: string | undefined;
    warehouseId: string | undefined;
    sku: string | undefined;
    // lotNum: string | undefined;
    descr: string | undefined;
    qty: number | undefined;
    qtyOrdered: number | undefined;
    qtyAllocated: number | undefined;
    qtyDamaged: number | undefined;
    qtyInTransit: number | undefined;
    lastModificationTime: moment.Moment | undefined;
    lastModifierUserId: number | undefined;
    creationTime: moment.Moment;
    creatorUserId: number | undefined;
    id: number;
}

export class InventoryItemListDto implements InventoryItemListDto {
    items!: InventoryItemDto[] | undefined;

    constructor(data?: IInventoryItemListDto) {
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
                for (let item of data["items"]){
                    
                    this.items!.push(InventoryItemDto.fromJS(item));
                }
            }
        }
    }

    static fromJS(data: any): InventoryItemListDto {
        data = typeof data === 'object' ? data : {};
        let result = new InventoryItemListDto();
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

export interface IInventoryItemListDto {
    items: InventoryItemDto[] | undefined;
}

export class InventoryItemDto implements IInventoryItemDto {
    sku!: string | undefined;
    warehouseId!: string | undefined;
    qty!: number | undefined;

    constructor(data?: IInventoryItemDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.sku = data["sku"];
            this.warehouseId = data["warehouseId"];
            this.qty = data["qty"];
        }
    }

    static fromJS(data: any): InventoryItemDto {
        data = typeof data === 'object' ? data : {};
        let result = new InventoryItemDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["sku"] = this.sku;
        data["warehouseId"] = this.warehouseId;
        data["qty"] = this.qty;
        return data; 
    }
}

export interface IInventoryItemDto {
    sku: string | undefined;
    warehouseId: string | undefined;
    qty: number | undefined;
}

export class PagedResultDtoOfInventoryBySKUListDto implements IPagedResultDtoOfInventoryBySKUListDto {
    totalCount!: number;
    items!: InventoryBySKUMasterDto[] | undefined;

    constructor(data?: IPagedResultDtoOfInventoryBySKUListDto) {
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
                    this.items!.push(InventoryBySKUMasterDto.fromJS(item));
            }
        }
    }

    static fromJS(data: any): PagedResultDtoOfInventoryBySKUListDto {
        data = typeof data === 'object' ? data : {};
        let result = new PagedResultDtoOfInventoryBySKUListDto();
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

export interface IPagedResultDtoOfInventoryBySKUListDto {
    totalCount: number;
    items: InventoryBySKUMasterDto[] | undefined;
}

export class InventoryBySKUMasterDto implements IInventoryBySKUMasterDto {
    sku!: string | undefined;
    warehouseId!: string | undefined;
    qcStatus!: string | undefined;
    noteText!: string | undefined;
    qty!: number | undefined;
    lastModificationTime!: moment.Moment | undefined;
    lastModifierUserId!: number | undefined;
    creationTime!: moment.Moment;
    creatorUserId!: number | undefined;
    id!: number;

    constructor(data?: IInventoryBySKUMasterDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.sku = data["sku"];
            this.warehouseId = data["warehouseId"];
            this.qcStatus = data["qcStatus"];
            this.noteText = data["noteText"];
            this.qty = data["qty"];
            this.lastModificationTime = data["lastModificationTime"] ? moment(data["lastModificationTime"].toString()) : <any>undefined;
            this.lastModifierUserId = data["lastModifierUserId"];
            this.creationTime = data["creationTime"] ? moment(data["creationTime"].toString()) : <any>undefined;
            this.creatorUserId = data["creatorUserId"];
            this.id = data["id"];
        }
    }

    static fromJS(data: any): InventoryBySKUMasterDto {
        data = typeof data === 'object' ? data : {};
        let result = new InventoryBySKUMasterDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["sku"] = this.sku;
        data["warehouseId"] = this.warehouseId;
        data["qcStatus"] = this.qcStatus;
        data["noteText"] = this.noteText;
        data["qty"] = this.qty;
        data["lastModificationTime"] = this.lastModificationTime ? this.lastModificationTime.toISOString() : <any>undefined;
        data["lastModifierUserId"] = this.lastModifierUserId;
        data["creationTime"] = this.creationTime ? this.creationTime.toISOString() : <any>undefined;
        data["creatorUserId"] = this.creatorUserId;
        data["id"] = this.id;
        return data; 
    }
}

export interface IInventoryBySKUMasterDto {
    sku: string | undefined;
    warehouseId: string | undefined;
    qcStatus: string | undefined;
    noteText: string | undefined;
    qty: number | undefined;
    lastModificationTime: moment.Moment | undefined;
    lastModifierUserId: number | undefined;
    creationTime: moment.Moment;
    creatorUserId: number | undefined;
    id: number;
}