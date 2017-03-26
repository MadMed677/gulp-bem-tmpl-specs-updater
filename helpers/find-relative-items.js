/**
 * Проходим по всем magicBundle и сравниваем его с tmpl-specs, который нам нужен
 *
 * @param {Array} magicBundles массив для
 * @return {Object}
 */
const findRelativeItems = (magicBundles, tmplSpecs) =>
    magicBundles
        .map((magicBundle) => {
            // Получаем уровни, конкретного девайса
            const magicDeviceLevels = devicesLevels[magicBundle.level];

            // На каком уровне был найден тест
            const suggestionLevel = magicDeviceLevels.find((magicDeviceLevel) => {
                const hashPath = magicDeviceLevel + '/' + magicBundle.block + '/' + magicBundle.test;

                return tmplSpecs[hashPath];
            });

            const referenceTmplSpec = tmplSpecs[suggestionLevel + '/' + magicBundle.block + '/' + magicBundle.test];
            const referenceMagicBundle = magicBundle;

            return {referenceMagicBundle, referenceTmplSpec};
        })
        .filter((references) =>
            references.referenceMagicBundle && references.referenceTmplSpec
        );

module.exports = findRelativeItems;
