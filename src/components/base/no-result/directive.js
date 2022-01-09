import noResult from './no-result.vue'
import { createloadingLikeDirective } from '@/assets/js/create-loading-like-directive.js'

const noResultDirective = createloadingLikeDirective(noResult)

export { noResultDirective }
