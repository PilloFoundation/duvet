export function mergeConfigs<LeftConfig, RightConfig>(
	leftConfig: LeftConfig,
	rightConfig: RightConfig
): LeftConfig & RightConfig {
	// TODO: Deep merge
	return {
		...leftConfig,
		...rightConfig,
	};
}
