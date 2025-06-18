import { queryParams, type QueryParams } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\UploadController::create
* @see app/Http/Controllers/UploadController.php:24
* @route '/upload'
*/
export const create = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: create.url(options),
    method: 'post',
})

create.definition = {
    methods: ['post'],
    url: '/upload',
}

/**
* @see \App\Http\Controllers\UploadController::create
* @see app/Http/Controllers/UploadController.php:24
* @route '/upload'
*/
create.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UploadController::create
* @see app/Http/Controllers/UploadController.php:24
* @route '/upload'
*/
create.post = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: create.url(options),
    method: 'post',
})

const UploadController = { create }

export default UploadController