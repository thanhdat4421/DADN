import { useEffect, useState } from "react";
import { StyleSheet, Dimensions, ScrollView } from "react-native";

import { Text, View } from "../components/Themed";
import { RootTabScreenProps } from "../types";
import { API } from "../api";
import { LineChart, BarChart } from "react-native-chart-kit";

const chartConfig = {
  backgroundGradientFrom: "#fff",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#fff",
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 3, // optional, default 3
  barPercentage: 1,
  useShadowColorFromDataset: false, // optional
};

export default function TabThreeScreen({
  navigation,
}: RootTabScreenProps<"TabOne">) {
  const [fan1, setFan1] = useState(0);
  const [fan2, setFan2] = useState(0);
  const [light1, setLight1] = useState(0);
  const [light2, setLight2] = useState(0);

  const [data, setData] = useState({
    labels: ["Quạt 1", "Quạt 2", "Đèn 1", "Đèn 2"],
    datasets: [
      {
        data: [fan1, fan2, light1, light2],
      },
    ],
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener("tabPress", (e) => {
      API.get("/devices").then(async (res) => {
        res.data.map((item: any) => {
          if (item.name === "Light_1") {
            setLight1(item.CountOn);
          } else if (item.name === "Fan_1") {
            setFan1(item.CountOn);
          } else if (item.name === "Light_2") {
            setLight2(item.CountOn);
          } else if (item.name === "Fan_2") {
            setFan2(item.CountOn);
          }
        });
      });
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    setData({
      labels: ["Đèn 1", "Đèn 2", "Quạt 1", "Quạt 2"],
      datasets: [
        {
          data: [light1, light2, fan1, fan2],
        },
      ],
    });
  }, [light1, light2, fan1, fan2]);
  return (
    <ScrollView>
      <View style={{ marginTop: 40 }}>
        <Text style={styles.title}>Biểu đồ Cột số lần bật của Đèn và Quạt</Text>
        <BarChart
          // style={graphStyle}
          style={{ marginTop: 20 }}
          data={data}
          width={Dimensions.get("window").width}
          height={300}
          yAxisLabel=""
          yAxisSuffix=""
          fromZero={true}
          chartConfig={chartConfig}
          verticalLabelRotation={0}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
