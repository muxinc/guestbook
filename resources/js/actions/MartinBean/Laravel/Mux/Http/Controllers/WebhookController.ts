import { queryParams, type QueryParams } from './../../../../../../wayfinder'
/**
* @see \MartinBean\Laravel\Mux\Http\Controllers\WebhookController::__invoke
* @see vendor/martinbean/mux-php-laravel/src/Http/Controllers/WebhookController.php:41
* @route '/mux/webhook'
*/
const WebhookController = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: WebhookController.url(options),
    method: 'post',
})

WebhookController.definition = {
    methods: ['post'],
    url: '/mux/webhook',
}

/**
* @see \MartinBean\Laravel\Mux\Http\Controllers\WebhookController::__invoke
* @see vendor/martinbean/mux-php-laravel/src/Http/Controllers/WebhookController.php:41
* @route '/mux/webhook'
*/
WebhookController.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return WebhookController.definition.url + queryParams(options)
}

/**
* @see \MartinBean\Laravel\Mux\Http\Controllers\WebhookController::__invoke
* @see vendor/martinbean/mux-php-laravel/src/Http/Controllers/WebhookController.php:41
* @route '/mux/webhook'
*/
WebhookController.post = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: WebhookController.url(options),
    method: 'post',
})

export default WebhookController