import { queryParams, type QueryParams } from './../../wayfinder'
/**
* @see \MartinBean\Laravel\Mux\Http\Controllers\WebhookController::webhook
* @see vendor/martinbean/mux-php-laravel/src/Http/Controllers/WebhookController.php:41
* @route '/mux/webhook'
*/
export const webhook = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: webhook.url(options),
    method: 'post',
})

webhook.definition = {
    methods: ['post'],
    url: '/mux/webhook',
}

/**
* @see \MartinBean\Laravel\Mux\Http\Controllers\WebhookController::webhook
* @see vendor/martinbean/mux-php-laravel/src/Http/Controllers/WebhookController.php:41
* @route '/mux/webhook'
*/
webhook.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return webhook.definition.url + queryParams(options)
}

/**
* @see \MartinBean\Laravel\Mux\Http\Controllers\WebhookController::webhook
* @see vendor/martinbean/mux-php-laravel/src/Http/Controllers/WebhookController.php:41
* @route '/mux/webhook'
*/
webhook.post = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: webhook.url(options),
    method: 'post',
})

const mux = {
    webhook,
}

export default mux