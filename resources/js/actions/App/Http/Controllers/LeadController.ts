import { queryParams, type QueryParams } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\LeadController::store
* @see app/Http/Controllers/LeadController.php:21
* @route '/lead'
*/
export const store = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ['post'],
    url: '/lead',
}

/**
* @see \App\Http\Controllers\LeadController::store
* @see app/Http/Controllers/LeadController.php:21
* @route '/lead'
*/
store.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeadController::store
* @see app/Http/Controllers/LeadController.php:21
* @route '/lead'
*/
store.post = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: store.url(options),
    method: 'post',
})

const LeadController = { store }

export default LeadController